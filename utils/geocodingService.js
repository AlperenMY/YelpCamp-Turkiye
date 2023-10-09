const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingService = mbxGeocoding({
  accessToken: process.env.MAPBOX_PUBLIC_TOKEN,
});
const forwardGeocode = async (query) => {
  const mapboxRes = await geocodingService
    .forwardGeocode({
      query,
      countries: ["tr"],
      limit: 1,
      language: ["tr"],
    })
    .send();
  return mapboxRes.body.features[0].geometry;
};

exports.forwardGeocode = forwardGeocode;
