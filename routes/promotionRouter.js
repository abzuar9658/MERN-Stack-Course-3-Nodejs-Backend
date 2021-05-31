const express = require("express");

const promotionRoute = express.Router();

promotionRoute.use(express.json());
promotionRoute.use(
  express.urlencoded({
    extended: true,
  })
);

promotionRoute
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send all the promotions to you!");
  })
  .post((req, res, next) => {
    res.end(
      "Will add the promotions: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res, next) => {
    res.end("Deleting all promotions");
  });

promotionRoute
  .route("/:promotionId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end(`Sending promtion with id ${req.params.promotionId}`);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported for this route address");
  })
  .put((req, res, next) => {
    res.end(`Updating promotion with id ${req.params.promotionId}`);
  })
  .delete((req, res, next) => {
    res.end(`Deleting promtion with id ${req.params.promotionId}`);
  });

module.exports = promotionRoute;
