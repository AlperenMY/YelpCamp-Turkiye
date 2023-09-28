const express = require("express");

const { Review } = require("../models/review");
const { Campground } = require("../models/campground");
const { catchAsync } = require("../utils/catchAsync");
const {
  validateInput,
  isLoggedIn,
  isReviewAuthor,
} = require("../utils/middleware");

const reviewsRouter = express.Router({ mergeParams: true });

reviewsRouter.post(
  "/",
  isLoggedIn,
  validateInput,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", "New review added");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

reviewsRouter.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/campgrounds/${id}`);
  })
);

exports.reviewsRouter = reviewsRouter;
