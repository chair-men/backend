const axios = require("axios");

const uraAxios = axios.create({
  baseURL: "https://www.ura.gov.sg/uraDataService/",
  timeout: 1000,
});

module.exports = { uraAxios };
