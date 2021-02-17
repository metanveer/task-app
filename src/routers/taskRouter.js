const express = require("express");
const router = new express.Router();
const Task = require("../models/taskModel");

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send("Server error :(");
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("No task found!");
    res.send(task);
  } catch (e) {
    res.status(500).send("Server error :(");
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const allowedKeys = ["description", "completed"];
  const updatedTask = req.body;
  const keysofUpdatedTask = Object.keys(updatedTask);

  const isAllowedOperation = keysofUpdatedTask.every((item) =>
    allowedKeys.includes(item)
  );

  if (!isAllowedOperation)
    return res.status(400).send({ error: "Invalid updates!" });

  try {
    const taskNeedtoUpdate = await Task.findById(req.params.id);

    //we need to update the taskNeedtoUpdate according to updatedTask and save the updated document

    keysofUpdatedTask.forEach((element) => {
      taskNeedtoUpdate[element] = updatedTask[element];
    });

    await taskNeedtoUpdate.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!taskNeedtoUpdate)
      return res.status(404).send("Requested task does not exist!");
    res.send(taskNeedtoUpdate);
  } catch (e) {
    res.status(404).send("Invalid Task ID to update");
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send("Task not found!");
    res.send(task);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
