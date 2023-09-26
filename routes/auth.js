const express = require("express");
const passport = require("passport");

const { User } = require("../models/user");
const { catchAsync } = require("../utils/catchAsync");

const authRouter = express.Router();

authRouter.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" });
});

authRouter.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const newUser = await User.register(user, password);
      console.log(newUser);
      req.flash("success", `Hey ${username} Welcome to Yelp-Camp Türkiye`);
      res.redirect("/campgrounds");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect(req.url);
    }
  })
);

authRouter.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

authRouter.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", `Welcome, ${req.body.username}`);
    res.redirect("/campgrounds");
  }
);

authRouter.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success", "Logout successfully");
    res.redirect("/campgrounds");
  });
});

exports.authRouter = authRouter;
