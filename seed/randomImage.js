const axios = require("axios");

const randomImage = async (query) => {
  try {
    const config = {
      params: {
        query,
        orientation: "landscape",
        client_id: process.env.UNSPLASH_ACCESS_KEY,
      },
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
    console.log("API error", error.response.data.errors);
  }
};

exports.randomImage = randomImage;
