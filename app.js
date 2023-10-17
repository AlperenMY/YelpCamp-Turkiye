if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const { AppError } = require("./utils/AppError");
const { reviewsRouter } = require("./routes/reviews");
const { campgroundsRouter } = require("./routes/campgrounds");
const { authRouter } = require("./routes/auth");
const { User } = require("./models/user");

const app = express();
const sessionConfig = {
  name: "ylpuid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    // secure: true,
  },
};
const scriptSrcUrls = ["https://cdn.jsdelivr.net", "https://api.mapbox.com"];
const imgSrcUrls = [
  "https://images.unsplash.com",
  `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
];
const connectSrcUrls = ["https://api.mapbox.com", "https://events.mapbox.com"];

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.log("MongoDB Eror: ", err);
  });

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(mongoSanitize());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
        imgSrc: ["self", "data:", ...imgSrcUrls],
        workerSrc: ["self", "blob:"],
        connectSrc: ["self", ...connectSrcUrls],
      },
    },
  })
);

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  if (!["/login", "/"].includes(req.originalUrl) && req.method === "GET") {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);
app.use("/", authRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new AppError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err, title: Error });
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
