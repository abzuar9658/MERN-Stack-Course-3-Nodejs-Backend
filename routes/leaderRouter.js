const express = require("express");
const Leader = require("../models/leaderModel");
const leaderRoute = express.Router();
const cors = require("./cors");

leaderRoute.use(express.json());
leaderRoute.use(
  express.urlencoded({
    extended: true,
  })
);

leaderRoute
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get(cors.cors, async (req, res, next) => {
    try {
      const leaders = await Leader.find({});
      res.setHeader("Content-Type", "application/json");
      return res.json(leaders);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  })
  .post(cors.corsWithOptions, async (req, res, next) => {
    const { name, image, description, designation, abbr, featured } = req.body;
    try {
      const leader = await Leader.create({
        name,
        image,
        description,
        designation,
        abbr,
        featured,
      });

      if (leader) {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        return res.json(leader);
      }
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      return res.send("Something went wrong", error.message);
    }
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  })
  .delete(cors.corsWithOptions, async (req, res, next) => {
    try {
      const leaders = await Leader.remove({});
      res.setHeader("Content-Type", "application/json");
      return res.json(leaders);
    } catch (error) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      return res.send("Something went wrong", error.message);
    }
  });

leaderRoute
  .route("/:leaderId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get(cors.cors, async (req, res, next) => {
    try {
      const leader = await Leader.findById(req.params.leaderId);
      res.setHeader("Content-Type", "application/json");
      return res.json(leader);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported for this route address");
  })
  .put(cors.corsWithOptions, async (req, res, next) => {
    try {
      const leader = await Leader.findByIdAndUpdate(
        req.params.leaderId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(leader);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  })
  .delete(cors.corsWithOptions, async (req, res, next) => {
    try {
      const leader = await Leader.findByIdAndRemove(req.params.leaderId);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(leader);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  });

module.exports = leaderRoute;
