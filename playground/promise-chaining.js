require("../src/db/mongoose");
const User = require("../src/models/user");

//60208adebede8027d4eb6eb4

// User.findByIdAndUpdate("6020c8e3362e8918549814c4", { age: 1 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const udpateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

udpateAgeAndCount("60208adebede8027d4eb6eb4", 2)
  .then((result) => {
    console.log("result", result);
  })
  .catch((e) => {
    console.log("e", e);
  });
