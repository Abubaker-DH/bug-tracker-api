import express from "express";
import mongoose from "mongoose";
const projects = require("../routes/projects");
const Bugs = require("../routes/bugs");
const users = require("../routes/users");

const app = express();
app.use(express.json());

app.use("/api/v1/users", users);
app.use("/api/v1/projects", projects);
app.use("/api/v1/bugs", Bugs);

const MONGO_URL = "mongodb://localhost:27017/bug-track-db";
const PORT = 5000;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port ${PORT} ...`))
  )
  .catch((error) => console.log(error.message));
