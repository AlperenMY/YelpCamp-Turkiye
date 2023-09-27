const axios = require("axios");

const { getUnsplashID } = require("./unsplashID"); //Make a function that get your unsplash client id

const randomImage = async (query) => {
  try {
    const id = getUnsplashID();
    const config = {
      params: { query, orientation: "landscape", client_id: id },
      headers: {
        "Accept-Version": "v1",
      },
    };
    const request = await axios.get(
      `https://api.unsplash.com/photos/random`,
      config
    );
    if (request.data.urls.small) {
      return request.data.urls.small;
    } else {
      throw new Error("No thumb image");
    }
  } catch (error) {
    console.log("API error", error);
  }
};

exports.randomImage = randomImage;
