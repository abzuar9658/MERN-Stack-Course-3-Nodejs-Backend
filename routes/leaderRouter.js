const express = require("express");

const leaderRoute = express.Router();

leaderRoute.use(express.json());
leaderRoute.use(
  express.urlencoded({
    extended: true,
  })
);

leaderRoute
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send all the leaders to you!");
  })
  .post((req, res, next) => {
    res.end(
      "Will add the leaders: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  })
  .delete((req, res, next) => {
    res.end("Deleting all leaders");
  });

leaderRoute
  .route("/:leaderId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end(`Sending leader with id ${req.params.leaderId}`);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported for this route address");
  })
  .put((req, res, next) => {
    res.end(`Updating leader with id ${req.params.leaderId}`);
  })
  .delete((req, res, next) => {
    res.end(`Deleting leader with id ${req.params.leaderId}`);
  });

module.exports = leaderRoute;
