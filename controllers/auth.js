const { User } = require("../models/user");
const { sendMail } = require("../utils/sendMail");

exports.renderRegisterForm = (req, res) => {
  res.render("auth/register", { title: "Register" });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const newUser = await User.register(user, password);
    req.login(newUser, async (err) => {
      if (err) return next(err);
      await sendMail(email, user._id, req.headers.host);
      req.flash("success", `Hey ${username} Welcome to Yelp-Camp Türkiye`);
      res.redirect("/campgrounds");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect(req.url);
  }
};

exports.renderLoginForm = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

exports.login = (req, res) => {
  req.flash("success", `Welcome, ${req.body.username}`);
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success", "Logout successfully");
    res.redirect("/campgrounds");
  });
};

exports.verifyEmail = async (req, res) => {
  if (req.query.token) {
    const userId = req.query.token;
    await User.findByIdAndUpdate(userId, { verified: true });
  } else {
    const user = req.user;
    await sendMail(user.email, user._id, req.headers.host);
    req.flash("success", `Verification email is sent to ${user.email}`);
  }
  res.redirect("/campgrounds");
};
