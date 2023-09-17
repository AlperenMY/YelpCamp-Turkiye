const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const { Campground } = require("./models/campground");
const { Review } = require("./models/review");
const { catchAsync } = require("./utils/catchAsync");
const { AppError } = require("./utils/AppError");
const { joiCampgroundSchema, joiReviewSchema } = require("./joiSchemas");

const app = express();

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

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.log("MongoDB Eror: ", err);
  });

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds, title: "Campgrounds" });
  })
);

app.post(
  "/campgrounds",
  validateInput,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new AppError("Invalid campground", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new", { title: "New Campground" });
});

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/show", { campground, title: campground.title });
  })
);

app.put(
  "/campgrounds/:id",
  validateInput,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground, title: "Edit Campground" });
  })
);

app.post(
  "/campgrounds/:id/reviews",
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

app.all("*", (req, res, next) => {
  next(new AppError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err, title: Error });
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
