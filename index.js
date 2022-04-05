import express from "express";
import mongoose from "mongoose";

const app = express();

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
