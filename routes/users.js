const express = require("express");
const { User, validateUser } = require("../models/user");
const router = express.Router();

// NOTE:  Get all users
router.get("/", async (req, res) => {
  const user = await User.find();
  res.send(user);
});

// NOTE:  Get one user by ID
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-isAdmin -password");
  if (!user)
    return res.status(404).send("The user with given ID was not found.");

  res.send(user);
});

// NOTE:  update user route
router.patch("/:id", async (req, res) => {
  let user = await User.findById({ _id: req.params.id });
  if (!user)
    return res.status(404).send("The user with given ID was not found");

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      profileImage: req.body.profileImage,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
    },
    { new: true }
  );

  res.send(user);
});

// NOTE:  Delete one User By ID
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove({
    _id: req.params.id,
  });

  if (!user)
    return res.status(404).send("The user with given ID was not found.");

  res.send(user);
});

module.exports = router;
