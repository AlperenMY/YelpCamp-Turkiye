const express = require("express");

const { Review } = require("../models/review");
const { Campground } = require("../models/campground");
const { catchAsync } = require("../utils/catchAsync");
const { validateInput } = require("../utils/validateInput");

const reviewsRouter = express.Router({ mergeParams: true });

reviewsRouter.post(
  "/",
  validateInput,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

reviewsRouter.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/campgrounds/${id}`);
  })
);

exports.reviewsRouter = reviewsRouter;
