const {
  selectServices,
  insertNewService,
  updateServiceStatus,
  selectServiceByServiceId,
  selectServicesByUserId,
} = require("../repositories/servicesRepos");
const uploadFile = require("../helpers/uploadFile");
const generateError = require("../helpers/generateError");
const {
  newServiceSchema,
  serviceIdSchema,
} = require("../schemas/servicesSchemas");

const getAllServices = async (req, res, next) => {
  try {
    const services = await selectServices();

    if (!services.length) {
      throw generateError("There are no services", 400);
    }

    res.status(200).send({
      status: "ok",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

const registerService = async (req, res, next) => {
  try {
    const userId = req.auth.id;

    await newServiceSchema.validateAsync(req.body);

    const { title, description } = req.body;

    console.log(req.body);
    const file = req.files?.file;

    if (!(title && description && file)) {
      throw generateError(
        "Your service must include title, description, and a file",
        400
      );
    }
    const fileName = await uploadFile(file, "requiredServices");

    const newServiceData = { userId, title, description, fileName };

    const insertId = await insertNewService(newServiceData);

    await res.status(200).send({
      status: "ok",
      message: "Your service has been successfully registered",
      data: { title: title, id: insertId },
    });
  } catch (error) {
    next(error);
  }
};

const setStatus = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    await serviceIdSchema.validateAsync(serviceId);

    const userId = req.auth.id;

    console.log(serviceId, userId);

    const service = await selectServiceByServiceId(serviceId);
    if (!service) {
      throw generateError(
        `The service you're trying to set the status for does not exist`,
        404
      );
    }

    const affectedRows = await updateServiceStatus(serviceId, userId);

    if (!affectedRows) {
      throw generateError(
        `You are not allowed to set the status of this service`,
        403
      );
    }
    res.status(200).send({
      status: "ok",
      message: "Your service has been marked as resolved",
    });
  } catch (error) {
    next(error);
  }
};

const getServicesbyUserId = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    const services = await selectServicesByUserId(userId);

    if (!services.length) {
      throw generateError("You haven't post any service yet", 400);
    }

    res.status(200).send({
      status: "ok",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  registerService,
  setStatus,
  getServicesbyUserId,
};
