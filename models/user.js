const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 10,
    },
    profileImage: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

function validateUser(user) {
  const schema = Joi.object({
    profileImage: Joi.string().allow(""),
    name: Joi.string().min(3).max(10),
    password: Joi.string().min(6).max(255),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
}

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports.User = mongoose.model("User", userSchema);
module.exports.validateUser = validateUser;
