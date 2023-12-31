const { Campground } = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const { forwardGeocode } = require("../utils/geocodingService");

exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds, title: "Campgrounds" });
};

exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  if (!req.files || req.files.length > 3) {
    req.flash("error", "You should upload min 1 max 3 photos");
    return res.redirect("/campgrounds/new");
  }
  campground.images = req.files.map((obj) => ({
    url: obj.path,
    filename: obj.filename,
  }));
  campground.defaultImage = campground.images[0].url;
  campground.geometry = await forwardGeocode(req.body.campground.location);
  await campground.save();
  req.flash(
    "success",
    `${campground.title} is added successfully to campgrounds`
  );
  res.redirect(`/campgrounds/${campground._id}`);
};

exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new", { title: "New Campground" });
};

exports.showCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground, title: campground.title });
};

exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  req.body.campground.geometry = await forwardGeocode(
    req.body.campground.location
  );
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground
  );
  if (req.body.deletedImages) {
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deletedImages } } },
    });
    for (const filename of req.body.deletedImages) {
      await cloudinary.uploader.destroy(filename);
    }
  }
  req.flash("success", "Campground updated");
  res.redirect(`/campgrounds/${id}`);
};

exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  const deleted = await Campground.findByIdAndDelete(id);
  for (const image of deleted.images) {
    await cloudinary.uploader.destroy(image.filename);
  }
  req.flash("success", "Campground deleted");
  res.redirect("/campgrounds");
};

exports.renderEditForm = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground, title: "Edit Campground" });
};
