const { Project, validateProject } = require("../models/project");
const express = require("express");
const router = express.Router();

// NOTE: get all projects
router.get("/", async (req, res) => {
  let projects;
  // INFO: admin will get all projects

  projects = await Project.find().populate("user", "-isAdmin");

  res.send(projects);
});

// NOTE: add new project
router.post("/", async (req, res) => {
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
router.patch("/:id", async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
    },
    { new: true }
  );

  if (!project)
    return res.status(404).send(" The project with given ID was not found.");
  res.send(project);
});

// NOTE: delete one project by id
router.delete("/:id", async (req, res) => {
  const project = await Project.findByIdAndRemove(req.params.id);
  if (!project)
    return res.status(404).send(" The project with given ID was not found.");

  return res.send(project);
});

// NOTE: get one project route
router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "user",
    "name _id profileImage"
  );
  if (!project)
    return res.status(404).send(" The project with given ID was not found.");

  res.send(project);
});

module.exports = router;
