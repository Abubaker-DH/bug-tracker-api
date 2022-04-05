const { Bug, validateBug } = require("../models/bug");
const express = require("express");
const router = express.Router();

// NOTE: get all Bugs
router.get("/", async (req, res) => {
  let Bugs;
  // INFO: get all Bugs
  Bugs = await Bug.find().populate("user", "-isAdmin");

  res.send(Bugs);
});

// NOTE: add new Bug
router.post("/", async (req, res) => {
  req.body.user = req.user._id;
  // INFO:  validate data send by user
  const { error } = validateBug(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const Bug = new Bug({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    projectId: req.body.projectId,
    user: req.user._id,
  });
  await Bug.save();

  res.status(201).send(Bug);
});

// NOTE: update Bug
router.patch("/:id", async (req, res) => {
  const Bug = await Bug.findByIdAndUpdate(
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

  if (!Bug)
    return res.status(404).send(" The Bug with given ID was not found.");
  res.send(Bug);
});

// NOTE: delete one Bug by id
router.delete("/:id", async (req, res) => {
  const Bug = await Bug.findByIdAndRemove(req.params.id);
  if (!Bug)
    return res.status(404).send(" The Bug with given ID was not found.");

  return res.send(Bug);
});

// NOTE: get one Bug route
router.get("/:id", async (req, res) => {
  const Bug = await Bug.findById(req.params.id).populate(
    "user",
    "name _id profileImage"
  );
  if (!Bug)
    return res.status(404).send(" The Bug with given ID was not found.");

  res.send(Bug);
});

module.exports = router;
