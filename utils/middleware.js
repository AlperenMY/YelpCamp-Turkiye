const { joiCampgroundSchema, joiReviewSchema } = require("../joiSchemas");
const { AppError } = require("./AppError");

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
    req.flash("error", "You should log in first");
    return res.redirect("/login");
  }
  next();
};

exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
