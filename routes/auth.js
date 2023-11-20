const express = require("express");
const passport = require("passport");

const { catchAsync } = require("../utils/catchAsync");
const { storeReturnTo } = require("../utils/middleware");
const authController = require("../controllers/auth");

const authRouter = express.Router();

authRouter
  .route("/register")
  .get(authController.renderRegisterForm)
  .post(catchAsync(authController.register));

authRouter
  .route("/login")
  .get(authController.renderLoginForm)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    authController.login
  );

authRouter.post("/logout", authController.logout);

authRouter.get("/verifyemail", authController.verifyEmail);

exports.authRouter = authRouter;
