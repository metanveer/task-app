const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const User = require("../models/userModel");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Logged out from all devices successfully");
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updatesAllowed = ["name", "email", "password", "age"];
  const updates = Object.keys(req.userBody);

  const isAllowedOperation = updates.every((item) =>
    updatesAllowed.includes(item)
  );

  if (!isAllowedOperation)
    return res.status(400).send({ error: "Invalid updates!" });

  try {
    // const user = await User.findById(req.params.id);

    updates.forEach((item) => (req.user[item] = req.userBody[item]));

    await req.user.save();

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // }); // this code don't use middlewares to update db data

    // if (!user) {
    //   return res.status(404).send();
    // }

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
