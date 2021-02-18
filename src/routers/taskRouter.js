const express = require("express");
const router = new express.Router();
const Task = require("../models/taskModel");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    // res.send(tasks);
    // Alternative:
    await req.user.populate("tasks").execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send("Server error :(");
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) return res.status(404).send("No task found!");
    res.send(task);
  } catch (e) {
    res.status(500).send("Server error :(");
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const allowedKeys = ["description", "completed"];
  const updatedTask = req.body;
  const keysofUpdatedTask = Object.keys(updatedTask);

  const isAllowedOperation = keysofUpdatedTask.every((item) =>
    allowedKeys.includes(item)
  );

  if (!isAllowedOperation)
    return res.status(400).send({ error: "Invalid updates!" });

  try {
    const taskNeedtoUpdate = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    //we need to update the taskNeedtoUpdate according to updatedTask and save the updated document
    if (!taskNeedtoUpdate)
      return res.status(404).send("Requested task does not exist!");

    keysofUpdatedTask.forEach((element) => {
      taskNeedtoUpdate[element] = updatedTask[element];
    });

    await taskNeedtoUpdate.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.send(taskNeedtoUpdate);
  } catch (e) {
    res.status(404).send("Invalid Task ID to update");
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send("Task not found!");
    res.send(task);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
