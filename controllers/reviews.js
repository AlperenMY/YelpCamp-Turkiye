const { Review } = require("../models/review");
const { Campground } = require("../models/campground");

exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  if (req.files.length > 3) {
    req.flash("error", "You cannot upload more than 3 photos");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  const imgs = req.files.map((obj) => ({
    url: obj.path,
    filename: obj.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  await review.save();
  req.flash("success", "New review added");
  res.redirect(`/campgrounds/${campground._id}`);
};

exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  res.redirect(`/campgrounds/${id}`);
};
