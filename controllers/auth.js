const { User } = require("../models/user");

exports.renderRegisterForm = (req, res) => {
  res.render("auth/register", { title: "Register" });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
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
