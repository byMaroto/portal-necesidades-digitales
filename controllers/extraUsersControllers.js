const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const {
  selectUserById,
  updateUserData,
  removeUser,
  updateEmail,
} = require("../repositories/extraUsersRepos");

const sendMail = require("../helpers/sendMail");
const generateError = require("../helpers/generateError");
const { checkUserSchema } = require("../schemas/usersSchemas");
const processAndSaveImage = require("../helpers/processUploadImage");

const editUser = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    const userDB = await selectUserById(userId);

    const { email, password } = req.body;

    await checkUserSchema.validateAsync(req.body);

    const picture = req.files?.picture;

    if (email) {
      const { SERVER_HOST, SERVER_PORT } = process.env;
      const registrationCode = uuidv4();
      await sendMail(
        "You are updating your email!",
        `
      <p>Activate your new email here:<p>
      <a href="http://${SERVER_HOST}:${SERVER_PORT}/users/activate/${registrationCode}">Activate account</a>
      `,
        email
      );

      await updateEmail(email, registrationCode, userId);
      res.status(201).send({
        status: "ok",
        message:
          "We've sent you a confirmation email. Please, find the link on your inbox and activate your account.",
      });
      return;
    }

    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    if (picture) {
      req.body.picture = await processAndSaveImage(picture.data);
    }
    console.log({ ...userDB, ...req.body });
    await updateUserData({ ...userDB, ...req.body });
    const updatedUserInfo = await selectUserById(userId);

    res.status(201).send({
      status: "Ok",
      message: "Your profile has been updated",
      data: updatedUserInfo,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user_id = req.auth.id;
    const affectedRows = await removeUser(user_id);

    if (!affectedRows) {
      throw generateError(`This user does not exist`, 404);
    }
    res.status(200).send({
      status: "ok",
      message: "User has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  editUser,
  deleteUser,
};
