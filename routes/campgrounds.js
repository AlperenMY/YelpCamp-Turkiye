const express = require("express");

const { Campground } = require("../models/campground");
const { catchAsync } = require("../utils/catchAsync");
const { validateInput } = require("../utils/validateInput");

const campgroundsRouter = express.Router();

campgroundsRouter.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds, title: "Campgrounds" });
  })
);

campgroundsRouter.post(
  "/",
  validateInput,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new AppError("Invalid campground", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

campgroundsRouter.get("/new", (req, res) => {
  res.render("campgrounds/new", { title: "New Campground" });
});

campgroundsRouter.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/show", { campground, title: campground.title });
  })
);

campgroundsRouter.put(
  "/:id",
  validateInput,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
  })
);

campgroundsRouter.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

campgroundsRouter.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground, title: "Edit Campground" });
  })
);

exports.campgroundsRouter = campgroundsRouter;
