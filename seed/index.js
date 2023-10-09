if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const { State, City } = require("country-state-city");

const { Campground } = require("../models/campground");
const { Review } = require("../models/review");
const { descriptors, places } = require("./seedHelpers");
const { randomImage } = require("./randomImage");
const { cloudinary } = require("../cloudinary");
const { forwardGeocode } = require("../utils/geocodingService");

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
  await Review.deleteMany({});
  await cloudinary.api.delete_resources_by_prefix("YelpCamp_Turkiye");
  for (let i = 0; i < 48; i++) {
    const randCity = Math.floor(Math.random() * cities.length);
    let randCityCode = "";
    if (randCity < 9) {
      randCityCode = `0${randCity + 1}`; // for zero index city code 01
    } else {
      randCityCode = `${randCity + 1}`;
    }
    const towns = City.getCitiesOfState("TR", randCityCode);
    const randTown = Math.floor(Math.random() * towns.length);
    const location = `${towns[randTown].name}, ${
      State.getStateByCodeAndCountry(randCityCode, "TR").name
    }`;
    const randPrice = Math.floor(Math.random() * 2000) / 100 + 10; //multiply&dividing 100 for 2 decimals
    const title = `${randMemOfArray(descriptors)} ${randMemOfArray(places)}`;
    const imageUrl = await randomImage(title);
    const author = "650dd21807ac94b6250beb70";
    const lon = towns[randTown].longitude;
    const lat = towns[randTown].latitude;
    const geometry = { type: "Point", coordinates: [lon, lat] };
    const newCamp = new Campground({
      location,
      title,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni at cumque modi vel qui repellendus earum facilis velit deserunt? Consectetur aut atque consequatur corrupti commodi possimus a dicta nesciunt voluptatibus?",
      price: randPrice,
      author,
      defaultImage: imageUrl,
      geometry,
    });
    const cloudinaryRes = await cloudinary.uploader.upload(imageUrl, {
      folder: "YelpCamp_Turkiye",
      transformation: [{ width: 400, height: 300, crop: "fill" }],
      use_filename: true,
    });
    newCamp.images.push({
      url: cloudinaryRes.secure_url,
      filename: cloudinaryRes.public_id,
    });
    await newCamp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
