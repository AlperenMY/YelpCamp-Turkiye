const express = require("express");

const { catchAsync } = require("../utils/catchAsync");
const { validateInput, isLoggedIn, isAuthor } = require("../utils/middleware");
const campgroundController = require("../controllers/campgrounds");

const campgroundsRouter = express.Router();

campgroundsRouter.get("/", catchAsync(campgroundController.index));

campgroundsRouter.post(
  "/",
  isLoggedIn,
  validateInput,
  catchAsync(campgroundController.createCampground)
);

campgroundsRouter.get("/new", isLoggedIn, campgroundController.renderNewForm);

campgroundsRouter.get("/:id", catchAsync(campgroundController.showCampground));

campgroundsRouter.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateInput,
  catchAsync(campgroundController.updateCampground)
);

campgroundsRouter.delete(
  "/:id",
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
