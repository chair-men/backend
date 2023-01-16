const { uraAxios } = require("./axios");
const axios = require("axios");

const getToken = async () => {
  const token = await uraAxios({
    method: "get",
    url: "insertNewToken.action",
    headers: { AccessKey: process.env.API_ACCESS_KEY },
  });
  return token.data;
};

const makeGetRequest = async (token, url) => {
  const response = await uraAxios({
    method: "get",
    url,
    headers: { AccessKey: process.env.API_ACCESS_KEY, token },
  });
  return response.data;
};

const getLocationFromPostalCode = async (postalCode) => {
  const locationData = await axios.get(
    `https://developers.onemap.sg/commonapi/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
  );
  if (locationData.data.found == 0) {
    return null;
  }
  return locationData.data.results[0];
};

const getLocationsFromPostalCode = async (postalCode) => {
  const locationData = await axios.get(
    `https://developers.onemap.sg/commonapi/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
  );
  if (locationData.data.found == 0) {
    return null;
  }
  // const ret = locationData.data.results.map((location) => {
  //   return { lat: location.LATITUDE, lng: location.LONGITUDE };
  // });
  // return ret;
  return locationData.data.results;
};

module.exports = {
  getToken,
  makeGetRequest,
  getLocationFromPostalCode,
  getLocationsFromPostalCode,
};
