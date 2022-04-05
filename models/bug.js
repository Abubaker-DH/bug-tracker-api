const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bugSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

function validatebug(bug) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string(),
    status: Joi.string(),
    projectId: Joi.objectid().required(),
    user: Joi.objectId().required(),
  });

  return schema.validate(bug);
}

module.exports.Bug = mongoose.model("Bug", bugSchema);
exports.validatebug = validatebug;
