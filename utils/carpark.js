const { makeGetRequest } = require("./helper");

const getActualCarparks = async (token) => {
  const result = await makeGetRequest(
    token,
    "invokeUraDS?service=Car_Park_Details"
  );
  return result;
};

module.exports = { getActualCarparks };
