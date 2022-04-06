const path = require("path");
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const dotenv = require("dotenv");
const error = require("../middleware/error");
const projects = require("../routes/projects");
const Bugs = require("../routes/bugs");
const users = require("../routes/users");
const auth = require("../routes/auth");

const app = express();
Joi.objectId = require("joi-objectid")(Joi);
app.use(express.json());
dotenv.config();

// INFO: Setup image folder and image name OR image URL
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/[\/\\:]/g, "-") +
        "-" +
        file.originalname
    );
  },
});

// INFO: Type of file that acceptaple to upload
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/PNG" ||
    file.mimetype === "image/JPG" ||
    file.mimetype === "image/JPEG"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single(
    "profileImage"
  )
);
app.use("/images", express.static(path.join(__dirname, "images")));

// INFO: api routes
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/projects", projects);
app.use("/api/v1/bugs", Bugs);
app.use(error);

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port ${PORT} ...`))
  )
  .catch((error) => console.log(error.message));
