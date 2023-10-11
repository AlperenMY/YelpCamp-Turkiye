const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Review } = require("./review");

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("upload/", "upload/w_200/");
});

const campgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [imageSchema],
    defaultImage: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    toJSON: { virtuals: true }, // <-- include virtuals in `JSON.stringify()`
  }
);

campgroundSchema.virtual("properties.popupHTML").get(function () {
  return `<a href= "/campgrounds/${this._id}">${this.title}</a><br>Price: ${this.price}₺`;
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

exports.Campground = mongoose.model("Campground", campgroundSchema);
