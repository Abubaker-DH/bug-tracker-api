import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const projects = require("../routes/projects");
const Bugs = require("../routes/bugs");
const users = require("../routes/users");
const auth = require("../routes/auth");

const app = express();
app.use(express.json());
dotenv.config();

app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/projects", projects);
app.use("/api/v1/bugs", Bugs);

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port ${PORT} ...`))
  )
  .catch((error) => console.log(error.message));
