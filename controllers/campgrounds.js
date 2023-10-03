const { Campground } = require("../models/campground");

exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds, title: "Campgrounds" });
};

exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  campground.images = req.files.map((obj) => ({
    url: obj.path,
    filename: obj.filename,
  }));
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
  await Campground.findByIdAndUpdate(id, req.body.campground);
  req.flash("success", "Campground updated");
  res.redirect(`/campgrounds/${id}`);
};

exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
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
