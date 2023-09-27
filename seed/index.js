const mongoose = require("mongoose");
const { State, City } = require("country-state-city");

const { Campground } = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");
const { randomImage } = require("./randomImage");

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
    if (randCity < 9) {
      randCityCode = `0${randCity + 1}`; // for zero index city code 01
    } else {
      randCityCode = `${randCity + 1}`;
    }
    const towns = City.getCitiesOfState("TR", randCityCode);
    const randTown = Math.floor(Math.random() * towns.length);
    const randPrice = Math.floor(Math.random() * 2000) / 100 + 10; //multiply&dividing 100 for 2 decimals
    const title = `${randMemOfArray(descriptors)} ${randMemOfArray(places)}`;
    const image = await randomImage(title);
    const author = "650dd21807ac94b6250beb70";
    const newCamp = new Campground({
      location: `${towns[randTown].name}, ${
        State.getStateByCodeAndCountry(randCityCode, "TR").name
      }`,
      title,
      image,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni at cumque modi vel qui repellendus earum facilis velit deserunt? Consectetur aut atque consequatur corrupti commodi possimus a dicta nesciunt voluptatibus?",
      price: randPrice,
      author,
    });
    await newCamp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
