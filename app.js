const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const { Campground } = require("./models/campground");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.log("MongoDB Eror: ", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/newcampground", async (req, res) => {
  const camp = new Campground({ title: "My Backyard" });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
