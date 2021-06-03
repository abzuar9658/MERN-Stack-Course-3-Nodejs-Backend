const express = require("express");
const Dish = require("../models/dishModel");

const dishRouter = express.Router();
dishRouter.use(express.json());
dishRouter.use(
  express.urlencoded({
    extended: true,
  })
);

dishRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get(async (req, res, next) => {
    try {
      const dishes = await Dish.find({});
      res.setHeader("Content-Type", "application/json");
      return res.json(dishes);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  })
  .post(async (req, res, next) => {
    const { name, image, category, label, price, featured, description } =
      req.body;
    try {
      const dish = await Dish.create({
        name,
        image,
        category,
        label,
        price,
        featured,
        description,
      });
      if (dish) {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        return res.json(dish);
      }
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      return res.send("Something went wrong", error.message);
    }
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete(async (req, res, next) => {
    try {
      const dishes = await Dish.remove({});
      res.setHeader("Content-Type", "application/json");
      return res.json(dishes);
    } catch (error) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      return res.send("Something went wrong", error.message);
    }
  });

dishRouter
  .route("/:dishId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get(async (req, res, next) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      res.setHeader("Content-Type", "application/json");
      return res.json(dish);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supprte for this route address");
  })
  .put(async (req, res, next) => {
    try {
      const dish = await Dish.findByIdAndUpdate(
        req.params.dishId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(dish);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const dish = await Dish.findByIdAndRemove(req.params.dishId);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(dish);
    } catch (error) {
      res.statusCode = 404;
      return res.send("Something went wrong", error.message);
    }
  });

dishRouter
  .route("/:dishId/comments")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            dish.comments.push(req.body);
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /dishes/" +
        req.params.dishId +
        "/comments"
    );
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            for (var i = dish.comments.length - 1; i >= 0; i--) {
              dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

dishRouter
  .route("/:dishId/comments/:commentId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /dishes/" +
        req.params.dishId +
        "/comments/" +
        req.params.commentId
    );
  })
  .put((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
              dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
              dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = dishRouter;
