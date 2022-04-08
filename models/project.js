const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    bugs: [{ bugId: { type: Schema.Types.ObjectId, ref: "Bug" } }],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

function validateProject(project) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    user: Joi.objectId().required(),
    bugId: Joi.objectId(),
  });

  return schema.validate(project);
}

module.exports.Project = mongoose.model("Project", projectSchema);
exports.validateProject = validateProject;
