const axios = require("axios");

const uraAxios = axios.create({
  baseURL: "https://www.ura.gov.sg/uraDataService/",
});

module.exports = { uraAxios };
