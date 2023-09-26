const express = require("express");

const { Campground } = require("../models/campground");
const { catchAsync } = require("../utils/catchAsync");
const { validateInput } = require("../utils/validateInput");
const { isLoggedIn } = require("../utils/isLoggedIn");

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
  isLoggedIn,
  validateInput,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash(
      "success",
      `${campground.title} is added successfully to campgrounds`
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

campgroundsRouter.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new", { title: "New Campground" });
});

campgroundsRouter.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground, title: campground.title });
  })
);

campgroundsRouter.put(
  "/:id",
  isLoggedIn,
  validateInput,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Campground updated");
    res.redirect(`/campgrounds/${id}`);
  })
);

campgroundsRouter.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted");
    res.redirect("/campgrounds");
  })
);

campgroundsRouter.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground, title: "Edit Campground" });
  })
);

exports.campgroundsRouter = campgroundsRouter;
