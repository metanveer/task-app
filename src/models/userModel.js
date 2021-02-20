const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./taskModel");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("Password can not contain 'password'!");
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

//Whatever we put after userSchema.methods. that will be available as user.generateAuthToken i.e will be available as method of instances of User model. This is also called instance method.

//In JavaScript, the JSON.stringify() function looks for functions named toJSON in the object being serialized. If an object has a toJSON function, JSON.stringify() calls toJSON() and serializes the return value from toJSON() instead. https://thecodebarbarian.com/what-is-the-tojson-function-in-javascript.html Express's res.send() uses JSON.stringify() behind the scene.

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewcourse");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//Whatever we put after userSchema.statics.sampleFunction that will be available as User.sampleFunction i.e. available in User model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

//Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// // userSchema.pre(
// //   "remove",
// //   { query: true, document: false },
// //   async function (next) {
// //     const user = this;

// //     console.log(user);

// //     try {
// //       console.log("just before deleting");
// //       const deletedTasks = await Task.deleteMany({
// //         description: "nasif task 1",
// //       });

// //       console.log("just after deleting");
// //       console.log("after deleting", deletedTasks);
// //     } catch (error) {
// //       console.log(e);
// //     }

// //     next();
// //   }
// // );

// userSchema.post("remove", (user) => {
//   Task.remove({ description: "something" });
// });

//Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
