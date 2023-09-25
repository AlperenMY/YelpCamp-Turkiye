const express = require("express");

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

exports.authRouter = authRouter;
