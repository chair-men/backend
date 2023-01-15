const { uraAxios } = require("./axios");

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

module.exports = { getToken, makeGetRequest };
