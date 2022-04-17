const express = require("express");
const mongoose = require("mongoose");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const { Bug, validateBug } = require("../models/bug");
const { Project } = require("../models/project");
const router = express.Router();

// NOTE: get all Bugs
router.get("/", auth, async (req, res) => {
  let bugs;
  // INFO: admin will get all bugs
  if (req.user.isAdmin) {
    bugs = await Bug.find()
      .populate("user", "name email profileImage")
      .select("-__v");
    return res.send(bugs);
  }

  // INFO: user get all bugs
  bugs = await Bug.find({ user: req.user._id }).populate(
    "user",
    "name email profileImage"
  );

  res.send(bugs);
});

// NOTE: add new bug
router.post("/", auth, async (req, res) => {
  req.body.user = req.user._id;
  // INFO:  validate data send by user
  const { error } = validateBug(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const project = await Project.findById(req.body.projectId);
  if (!project)
    return res.status(404).send("The projcet with given ID was not found.");

  const bug = new Bug({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    projectId: req.body.projectId,
    user: req.user._id,
  });

  try {
    const updateBugs = [...project.bugs];
    updateBugs.push({ bugId: bug._id });
    project.bugs = updateBugs;
    await bug.save();
    await project.save();
  } catch (error) {
    console.log("Error saving bug", error);
  }
  res.status(201).send(bug);
});

// NOTE: update bug
router.patch("/:id", [auth, validateObjectId], async (req, res) => {
  let bug = await Bug.findById(req.params.id);
  if (!bug)
    return res.status(404).send(" The bug with given ID was not found.");

  // INFO: the owner or admin can update the bug
  if (
    req.user._id.toString() !== bug.user._id.toString() ||
    req.user.isAdmin === "false"
  ) {
    return res.status(405).send("Method not allowed.");
  }

  bug = await Bug.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
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

  let project = await Project.findById(bug.projectId);

  // INFO: the owner or admin can delete the bug
  if (
    req.user._id.toString() !== bug.user._id.toString() ||
    req.user.isAdmin === "false"
  ) {
    return res.status(405).send("Method not allowed.");
  }

  // INFO: use transaction to update multiple doc
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    bug = await Bug.findByIdAndRemove(req.params.id, { session });
    let projectBugs = [...project.bugs];
    const pB = projectBugs.filter((cb) => {
      return cb.bugId.toString() !== req.params.id.toString();
    });
    projectBugs = pB;
    project.bugs = projectBugs;
    project.save();
    if (projectBugs.length() == pB.length()) {
      await session.abortTransaction();
      return res.send("failed to delete project ");
    }

    await session.commitTransaction();
    return res.send(bug);
  } catch (error) {
    console.log("error deleting bug", error);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
});

// NOTE: get one bug route
router.get("/:id", [auth, validateObjectId], async (req, res) => {
  let bug = await Bug.findById(req.params.id);
  if (!bug)
    return res.status(404).send(" The bug with given ID was not found.");

  // INFO: the owner or admin can get the bug
  if (
    req.user._id.toString() !== bug.user._id.toString() ||
    req.user.isAdmin === "false"
  ) {
    return res.status(405).send("Method not allowed.");
  }
  bug = await Bug.findById(req.params.id).populate(
    "user",
    "name _id profileImage"
  );

  res.send(bug);
});

module.exports = router;
