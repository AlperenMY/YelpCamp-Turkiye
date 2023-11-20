const { joiCampgroundSchema, joiReviewSchema } = require("../joiSchemas");
const { AppError } = require("./AppError");
const { Campground } = require("../models/campground");
const { Review } = require("../models/review");

exports.validateInput = (req, res, next) => {
  let result;
  if (req.body.campground) {
    result = joiCampgroundSchema.validate(req.body);
  } else if (req.body.review) {
    result = joiReviewSchema.validate(req.body);
  } else {
    throw new AppError("Bad request!Please provide required info!", 400);
  }
  const { error } = result;
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You have to log in first");
    return res.redirect("/login");
  } else if (!req.user.verified) {
    req.flash(
      "error",
      "You have to verify your email before this action. Click &nbsp<a href='/verifyemail'>here</a>&nbsp to verify email! "
    );
    return res.redirect("/campgrounds");
  }
  next();
};

exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You're not allowed for this!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You're not allowed for this!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
