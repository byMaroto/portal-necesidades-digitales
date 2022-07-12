const {
  selectUserByEmail,
  insertUser,
  selectUserByActivationCode,
  deleteRegistrationCode,
  selectUserInfoById,
} = require("../repositories/usersRepos");
const { selectServicesByUserId } = require("../repositories/servicesRepos");
const generateError = require("../helpers/generateError");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("../helpers/sendMail");
const {
  registerUserSchema,
  checkUserSchema,
} = require("../schemas/usersSchemas");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const processAndSaveImage = require("../helpers/processUploadImage");

const registerUser = async (req, res, next) => {
  try {
    await registerUserSchema.validateAsync(req.body);

    const { name, email, password, bio } = req.body;

    const picture = req.files?.picture;

    const user = await selectUserByEmail(email);

    if (email === user?.email) {
      throw generateError("This email has already been registered", 400);
    }

    const registrationCode = uuidv4();

    const encryptedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      encryptedPassword,
      bio,
      registrationCode,
    };
    if (picture) {
      const pictureName = await processAndSaveImage(picture.data);

      userData.pictureName = pictureName;
    }

    const insertId = await insertUser(userData);
    const { SERVER_HOST, SERVER_PORT } = process.env;

    await sendMail(
      "Welcome to the best digital services portal!",
      `
      <p>Activate your account here: <p>
      <a href="http://${SERVER_HOST}:${SERVER_PORT}/users/activate/${registrationCode}">Activate account</a>
      `,
      email
    );

    res.status(201).send({
      status: "ok",
      message: "Please, check your email to confirm it's you!",
      data: { id: insertId, ...userData },
    });
  } catch (error) {
    next(error);
  }
};

const activateUser = async (req, res, next) => {
  try {
    const { registrationCode } = req.params;

    const user = await selectUserByActivationCode(registrationCode);

    if (!user) {
      throw generateError(
        "Invalid registration code or already activated",
        404
      );
    }

    await deleteRegistrationCode(user.id);

    res.status(200).send({ status: "ok", message: "User activated" });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    await checkUserSchema.validateAsync(req.body);
    const { email, password } = req.body;

    const user = await selectUserByEmail(email);

    const encryptedPassword = user?.password;

    const isLoginValid =
      user && (await bcrypt.compare(password, encryptedPassword));

    if (!isLoginValid) {
      throw generateError("Wrong password or email", 400);
    }

    if (user.registrationCode) {
      throw generateError(
        "User not activated. Check your inbox and activate it through the link.",
        400
      );
    }

    const tokenPayload = {
      id: user.id,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).send({
      status: "ok",
      message: "User successfully logged!",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    const userInfo = await selectUserInfoById(userId);

    if (!userInfo) {
      throw generateError("This user does not exist", 400);
    }
    const userServices = await selectServicesByUserId(userId);

    res.status(200).send({
      status: "ok",
      data: { ...userInfo, services: userServices },
    });
  } catch (error) {
    next(error);
  }
};

const getAnyUserInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userInfo = await selectUserInfoById(userId);

    if (!userInfo) {
      throw generateError("This user does not exist", 400);
    }

    res.status(200).send({
      status: "ok",
      data: userInfo,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  activateUser,
  loginUser,
  getUserInfo,
  getAnyUserInfo,
};
