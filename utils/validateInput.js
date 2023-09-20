const { joiCampgroundSchema, joiReviewSchema } = require("../joiSchemas");
const { AppError } = require("./AppError");

const validateInput = (req, res, next) => {
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

exports.validateInput = validateInput;
