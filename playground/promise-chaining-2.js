require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("602135366ae80d3b004fc4b0")
//   .then((result) => {
//     console.log(result);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const deleteTaskAndCount = async (id) => {
  const deletedTask = await Task.findByIdAndDelete(id);
  console.log("Deleted Task:", deletedTask);
  const incompleteTasksCount = await Task.countDocuments({ completed: false });

  return incompleteTasksCount;
};

deleteTaskAndCount("6020cf7dc947a3069ce90f34")
  .then((count) => {
    console.log("count", count);
  })
  .catch((e) => {
    console.log(e);
  });
