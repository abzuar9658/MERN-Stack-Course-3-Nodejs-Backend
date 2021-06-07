const express = require("express");
const Promotion = require("../models/promotionModel");
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
  .get(async (req, res, next) => {
    try {
      const promotions = await Promotion.find({});
      res.setHeader("Content-Type", "application/json");
      return res.json(promotions);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  })

  .post(authenticate.verifyUser, async (req, res, next) => {
    const { name, image, label, price, featured, description } = req.body;
    try {
      const promotion = await Promotion.create({
        name,
        image,
        label,
        price,
        featured,
        description,
      });

      if (promotion) {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        return res.json(promotion);
      }
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      return res.send("Something went wrong", error.message);
    }
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete(authenticate.verifyUser, async (req, res, next) => {
    try {
      const promotions = await Promotion.remove({});
      res.setHeader("Content-Type", "application/json");
      return res.json(promotions);
    } catch (error) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      return res.send("Something went wrong", error.message);
    }
  });

promotionRoute
  .route("/:promotionId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get(async (req, res, next) => {
    try {
      const promotion = await Promotion.findById(req.params.promotionId);
      res.setHeader("Content-Type", "application/json");
      return res.json(promotion);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported for this route address");
  })
  .put(authenticate.verifyUser, async (req, res, next) => {
    try {
      const promotion = await Promotion.findByIdAndUpdate(
        req.params.promotionId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(promotion);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  })
  .delete(authenticate.verifyUser, async (req, res, next) => {
    try {
      const promotion = await Promotion.findByIdAndRemove(
        req.params.promotionId
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(promotion);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  });

module.exports = promotionRoute;
