const express = require("express");
const { User, validateUser } = require("../models/user");
const auth = require("../middleware/auth");
const router = express.Router();

// NOTE:  Get all users
router.get("/", auth, async (req, res) => {
  const user = await User.find();
  res.send(user);
});

// NOTE:  Get one user by ID
router.get("/:id", auth, async (req, res) => {
  let user;
  if (req.user.isAdmin) {
    user = await User.findById(req.params.id);
  } else {
    user = await User.findById(req.params.id).select("-isAdmin -password");
  }
  if (!user)
    return res.status(404).send("The user with given ID was not found.");

  res.send(user);
});

// NOTE:  update user route
router.patch("/:id", auth, async (req, res) => {
  let user = await User.findById({ _id: req.params.id });
  if (!user)
    return res.status(404).send("The user with given ID was not found");

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // INFO:  the owner or admin can update
  if (
    req.user._id.toString() !== req.params.id.toString() ||
    !req.user.isAdmin
  ) {
    return res.status(403).send("method not allowed.");
  }

  // INFO: the user can not change his account to be ADMIN
  if (req.body.isAdmin === "true" || !req.user.isAdmin) {
    return res.status(403).send("method not allowed.");
  }

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
router.delete("/:id", auth, async (req, res) => {
  const user = await User.findByIdAndRemove({
    _id: req.params.id,
    isAdmin: false,
  });

  if (!user)
    return res.status(404).send("The user with given ID was not found.");

  res.send(user);
});

module.exports = router;
