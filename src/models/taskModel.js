const mongoose = require("mongoose");
const User = require("./userModel");
const { Schema } = mongoose;

const taskSchema = new Schema({
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

taskSchema.pre("save", async function (next) {
  const task = this;

  console.log(`Just before saving this ${task.description} Task!`);

  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
