const generateError = require("../helpers/generateError");
const uploadFile = require("../helpers/uploadFile");
const {
  selectServiceById,
  insertCommentsFile,
} = require("../repositories/commentsRepos");
const commentSchema = require("../schemas/commentSchema");
const { serviceIdSchema } = require("../schemas/servicesSchemas");

const sendCommentFile = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    const { serviceId } = req.params;
    await serviceIdSchema.validateAsync(serviceId);

    const service = await selectServiceById(serviceId);
    if (!service) {
      throw generateError(`This service does not exist`, 404);
    }

    const { comment } = req.body;

    await commentSchema.validateAsync(comment);

    const solvedFile = req.files?.solvedFile;

    if (!(solvedFile || comment)) {
      throw generateError(`You must submit a comment and/or a file`, 400);
    }
    const commentData = { userId, serviceId };

    if (comment) {
      commentData.comment = comment;
    }
    if (solvedFile) {
      const solvedFileName = await uploadFile(solvedFile, "solvedServices");
      commentData.solvedFile = solvedFileName;
    }

    const insertID = await insertCommentsFile(commentData);

    res.status(201).send({
      status: "ok",
      message: "You have successfully submited your comment and/or your work",
      data: { comment_id: insertID },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = sendCommentFile;
