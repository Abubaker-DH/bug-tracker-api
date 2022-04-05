const { Bug, validateBug } = require("../models/bug");
const auth = require("../middleware/auth");
const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

// NOTE: get all Bugs
router.get("/", auth, async (req, res) => {
  let bugs;
  // INFO: admin will get all bugs
  if (req.user.isAdmin) {
    bugs = await Bug.find().populate("user", "-isAdmin").select("-__v");
    return res.send(bugs);
  }

  // INFO: user get all bugs
  bugs = await Bug.find({ user: req.user._id }).populate("user", "-isAdmin");

  res.send(bugs);
});

// NOTE: add new bug
router.post("/", auth, async (req, res) => {
  req.body.user = req.user._id;
  // INFO:  validate data send by user
  const { error } = validateBug(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const bug = new Bug({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    projectId: req.body.projectId,
    user: req.user._id,
  });
  await bug.save();

  res.status(201).send(bug);
});

// NOTE: update bug
router.patch("/:id", [auth, validateObjectId], async (req, res) => {
  let bug = await Bug.findById(req.params.id);
  if (!bug)
    return res.status(404).send(" The bug with given ID was not found.");

  // INFO: the owner or admin can update the bug
  if (req.user._id !== bug.user._id || req.user.isAdmin === "false") {
    return res.status(405).send("Method not allowed.");
  }
  bug = await Bug.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      projectId: req.body.projectId,
      user: req.user._id,
    },
    { new: true }
  );

  res.send(bug);
});

// NOTE: delete one bug by id
router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  let bug = await Bug.findById(req.params.id);
  if (!bug)
    return res.status(404).send(" The bug with given ID was not found.");

  // INFO: the owner or admin can delete the bug
  if (req.user._id !== bug.user._id || req.user.isAdmin === "false") {
    return res.status(405).send("Method not allowed.");
  }
  bug = await Bug.findByIdAndRemove(req.params.id);
  return res.send(bug);
});

// NOTE: get one bug route
router.get("/:id", [auth, validateObjectId], async (req, res) => {
  let bug = await Bug.findById(req.params.id);
  if (!bug)
    return res.status(404).send(" The bug with given ID was not found.");

  // INFO: the owner or admin can get the bug
  if (req.user._id !== bug.user._id || req.user.isAdmin === "false") {
    return res.status(405).send("Method not allowed.");
  }
  bug = await Bug.findById(req.params.id).populate(
    "user",
    "name _id profileImage"
  );

  res.send(bug);
});

module.exports = router;
