const mongoose = require("mongoose");

const { Campground } = require("../models/campground");
const { cities } = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.log("MongoDB Eror: ", err);
  });

const randMemOfArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const newCamp = new Campground({
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      title: `${randMemOfArray(descriptors)} ${randMemOfArray(places)}`,
    });
    await newCamp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
