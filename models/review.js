const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
});

exports.Review = mongoose.model("Review", reviewSchema);
