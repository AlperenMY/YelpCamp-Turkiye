const express = require("express");
const passport = require("passport");

const { catchAsync } = require("../utils/catchAsync");
const { storeReturnTo } = require("../utils/middleware");
const authController = require("../controllers/auth");

const authRouter = express.Router();

authRouter.get("/register", authController.renderRegisterForm);

authRouter.post("/register", catchAsync(authController.register));

authRouter.get("/login", authController.renderLoginForm);

authRouter.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  authController.login
);

authRouter.post("/logout", authController.logout);

exports.authRouter = authRouter;
