const express = require("express");

const { catchAsync } = require("../utils/catchAsync");
const {
  validateInput,
  isLoggedIn,
  isReviewAuthor,
} = require("../utils/middleware");
const reviewsController = require("../controllers/reviews");

const reviewsRouter = express.Router({ mergeParams: true });

reviewsRouter.post(
  "/",
  isLoggedIn,
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
