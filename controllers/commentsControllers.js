const generateError = require("../helpers/generateError");
const uploadFile = require("../helpers/uploadFile");
const {
  selectServiceById,
  insertCommentsFile,
  selectServiceByServiceId,
  selectCommentsbyServiceId,
  selectCommentbyCommentId,
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
    const newCommentInfo = await selectCommentbyCommentId(insertID);

    res.status(201).send({
      status: "ok",
      message: "You have successfully submited your comment and/or your work",
      data: newCommentInfo,
    });
  } catch (error) {
    next(error);
  }
};

const getCommentsbyServiceId = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const service = await selectServiceByServiceId(serviceId);
    const comments = await selectCommentsbyServiceId(serviceId);

    if (!service) {
      throw generateError("There is no service", 400);
    }

    res.status(200).send({
      status: "ok",
      data: [service, comments],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendCommentFile, getCommentsbyServiceId };
