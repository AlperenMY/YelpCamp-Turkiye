const express = require("express");
const multer = require("multer");

const { catchAsync } = require("../utils/catchAsync");
const { validateInput, isLoggedIn, isAuthor } = require("../utils/middleware");
const campgroundController = require("../controllers/campgrounds");
const { storage } = require("../cloudinary/index");

const campgroundsRouter = express.Router();
const parser = multer({ storage });

campgroundsRouter
  .route("/")
  .get(catchAsync(campgroundController.index))
  .post(
    isLoggedIn,
    parser.array("image"),
    validateInput,
    catchAsync(campgroundController.createCampground)
  );

campgroundsRouter.get("/new", isLoggedIn, campgroundController.renderNewForm);

campgroundsRouter
  .route("/:id")
  .get(catchAsync(campgroundController.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateInput,
    catchAsync(campgroundController.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundController.deleteCampground)
  );

campgroundsRouter.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundController.renderEditForm)
);

exports.campgroundsRouter = campgroundsRouter;
