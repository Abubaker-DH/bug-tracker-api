const { Project, validateProject } = require("../models/project");
const express = require("express");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

// NOTE: get all projects
router.get("/", auth, async (req, res) => {
  let projects;
  // INFO: admin will get all projects
  if (req.user.isAdmin) {
    projects = await Project.find().populate("user", "-isAdmin").select("-__v");
    return res.send(projects);
  }

  // INFO: user will get owen project
  projects = await Project.find({ user: req.user._id }).populate(
    "user",
    "-isAdmin"
  );

  res.send(projects);
});

// NOTE: add new project
router.post("/", auth, async (req, res) => {
  req.body.user = req.user._id;
  // INFO:  validate data send by user
  const { error } = validateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const project = new Project({
    title: req.body.title,
    user: req.user._id,
  });
  await project.save();

  res.status(201).send(project);
});

// NOTE: update project
router.patch("/:id", [auth, validateObjectId], async (req, res) => {
  let project = await Project.findById(req.params.id);
  if (!project)
    return res.status(404).send(" The project with given ID was not found.");

  // INFO: the owner or admin can update the project
  if (req.user._id !== project.user._id || req.user.isAdmin === "false") {
    return res.status(405).send("Method not allowed.");
  }

  project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
    },
    { new: true }
  );

  res.send(project);
});

// NOTE: delete one project by id
router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  let project = await Project.findById(req.params.id);
  if (!project)
    return res.status(404).send(" The project with given ID was not found.");

  // INFO: the owner or admin can delete the project
  if (req.user._id !== project.user._id || req.user.isAdmin === "false") {
    return res.status(405).send("Method not allowed.");
  }

  project = await Project.findByIdAndRemove(req.params.id);
  return res.send(project);
});

// NOTE: get one project route
router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "user",
    "name _id profileImage"
  );
  if (!project)
    return res.status(404).send(" The project with given ID was not found.");

  // INFO: the owner or admin can get project details
  if (
    req.user._id.toString() !== project.user._id.toString() ||
    req.user.isAdmin === "false"
  ) {
    return res.status(405).send("Method not allowed.");
  }

  res.send(project);
});

module.exports = router;
