const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.use(express.json());
router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user != null) {
      const err = new Error("User " + req.body.username + " already exists!");
      err.status = 403;
      next(err);
    } else {
      const user = await User.create({
        username: req.body.username,
        password: req.body.password,
      });
      if (user) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return res.json({ status: "Registration Successful!", user: user });
      }
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  if (!req.session.user) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }

    const auth = new Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const username = auth[0];
    const password = auth[1];
    try {
      const user = await User.findOne({ username: username });
      if (user === null) {
        const err = new Error("User " + username + " does not exist!");
        err.status = 403;
        return next(err);
      } else if (user.password !== password) {
        const err = new Error("Your password is incorrect!");
        err.status = 403;
        return next(err);
      } else if (user.username === username && user.password === password) {
        req.session.user = "authenticated";
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("You are authenticated!");
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("You are already authenticated!");
  }
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
