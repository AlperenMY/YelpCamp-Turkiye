const Joi = require("joi");

exports.joiCampgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
});

exports.joiReviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5),
  }).required(),
});
