const { makeGetRequest } = require("./helper");

const getActualCarparks = async (token) => {
  const result = await makeGetRequest(
    token,
    "invokeUraDS?service=Car_Park_Details"
    // "invokeUraDS?service=Car_Park_Availability"
  );
  return result;
};

module.exports = { getActualCarparks };
