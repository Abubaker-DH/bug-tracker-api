const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

function validateProject(project) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(project);
}

module.exports.Project = mongoose.model("Project", projectSchema);
exports.validateProject = validateProject;
