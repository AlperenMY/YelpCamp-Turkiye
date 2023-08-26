const mongoose = require("mongoose");
const { State, City } = require("country-state-city");

const { Campground } = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");

const cities = State.getStatesOfCountry("TR");

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
    const randCity = Math.floor(Math.random() * cities.length);
    let randCityCode = "";
    if (randCity < 10) {
      randCityCode = `0${randCity}`;
    } else {
      randCityCode = `${randCity}`;
    }
    const towns = City.getCitiesOfState("TR", randCityCode);
    const randTown = Math.floor(Math.random() * towns.length);
    const newCamp = new Campground({
      location: `${towns[randTown].name}, ${
        State.getStateByCodeAndCountry(randCityCode, "TR").name
      }`,
      title: `${randMemOfArray(descriptors)} ${randMemOfArray(places)}`,
    });
    await newCamp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
