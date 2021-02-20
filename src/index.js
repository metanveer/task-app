const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");

const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET requests are disable");
//   } else {
//     next();
//   }
// });

// app.use((req, res, next) => {
//   res.status(503).send("Site is under maintenance. Pls check back soon...");
// });

const multer = require("multer");
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith(".pdf")) {
    //   return cb(new Error("Please uplodad a PDF"));
    // }
    //Alternative
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error("Please uplodad a PDF"));
    }

    cb(undefined, true);

    // cb(new Error("File must be a PDF")); //If error occurs
    //cb means callback
    // cb(undefined, true)  //  Accepting the file
    // cb(undefined, false) // Rejecting the file
  },
});
app.post("/upload", upload.single("upload"), (req, res) => {
  res.send();
});

app.use(express.json()); // a feature of express to perse the incomming json request in in http body
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// //In JavaScript, the JSON.stringify() function looks for functions named toJSON in the object being serialized. If an object has a toJSON function, JSON.stringify() calls toJSON() and serializes the return value from toJSON() instead. https://thecodebarbarian.com/what-is-the-tojson-function-in-javascript.html

// const pet = {
//   name: "hal",
//   age: 27,
// };

// pet.toJSON = function () {
//   // console.log(this);
//   return this;
// };

// // console.log(pet.toJSON);

// console.log(JSON.stringify(pet));

// const Task = require("./models/taskModel");
// const User = require("./models/userModel");

// const main = async () => {
//   // const task = await Task.findById("602c72f5e1520f14404ac17f");
//   // await task.populate("owner").execPopulate();
//   // console.log(task.owner);

//   const user = await User.findById("602c72d4e1520f14404ac17d");
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// };

// main();
