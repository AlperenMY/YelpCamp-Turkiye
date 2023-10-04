const express = require("express");
const multer = require("multer");

const { catchAsync } = require("../utils/catchAsync");
const {
  validateInput,
  isLoggedIn,
  isReviewAuthor,
} = require("../utils/middleware");
const reviewsController = require("../controllers/reviews");
const { storage } = require("../cloudinary/index");

const reviewsRouter = express.Router({ mergeParams: true });
const parser = multer({ storage });

reviewsRouter.post(
  "/",
  isLoggedIn,
  parser.array("image"),
  validateInput,
  catchAsync(reviewsController.createReview)
);

reviewsRouter.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewsController.deleteReview)
);

exports.reviewsRouter = reviewsRouter;
