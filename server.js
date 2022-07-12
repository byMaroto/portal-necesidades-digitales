const express = require("express");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cors = require("cors");

const {
  registerUser,
  activateUser,
  loginUser,
  getUserInfo,
  getAnyUserInfo,
} = require("./controllers/usersControllers");

const {
  getAllServices,
  registerService,
  setStatus,
  getServicesbyUserId,
} = require("./controllers/servicesControllers");

const {
  sendCommentFile,
  getCommentsbyServiceId,
} = require("./controllers/commentsControllers");

const { editUser, deleteUser } = require("./controllers/extraUsersControllers");

const validateAuth = require("./middlewares/authentication");
const notFound = require("./middlewares/NotFound");
const errorHandler = require("./middlewares/errorhandler");

const { SERVER_PORT } = process.env;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3001"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload());
app.use(express.static("./uploads"));

//USERS ENDPOINTS
app.post("/users", registerUser);
app.get("/users/activate/:registrationCode", activateUser);
app.post("/login", loginUser);
app.get("/user", validateAuth, getUserInfo);
app.get("/user/:userId", validateAuth, getAnyUserInfo);

//SERVICES ENDPOINTS
app.get("/", getAllServices);
app.post("/services", validateAuth, registerService);
app.patch("/services/:serviceId", validateAuth, setStatus);
app.get("/services/user", validateAuth, getServicesbyUserId);

//COMMENTS ENDPOINTS
app.post("/comments/:serviceId", validateAuth, sendCommentFile);
app.get("/getcomments/:serviceId", validateAuth, getCommentsbyServiceId);

//EXTRA USER ENDPOINTS
app.patch("/users", validateAuth, editUser);
app.delete("/users", validateAuth, deleteUser);

//Middleware 404
app.use(notFound);

//Middleware Error
app.use(errorHandler);

//Server Listening
app.listen(SERVER_PORT, () => {
  console.log(`Server listening at localhost:${SERVER_PORT}`);
});
