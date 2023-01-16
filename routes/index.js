var express = require("express");
const { getToken, getLocationFromPostalCode } = require("../utils/helper");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/token", async function (req, res, next) {
  const token = (await getToken())["Result"];
  res.cookie("apitoken", token, {
    expires: new Date(Date.now() + 12 * 3600000),
  });
  res.send("OK.");
});

router.get("/coords", async function (req, res, next) {
  if (!req.query?.postal) {
    res.send({ error: "Please add the postal query parameter." });
    return;
  }
  const locs = await getLocationFromPostalCode(req.query.postal);
  console.log(locs)
  if (locs === null) {
    res.send({ error: "Invalid Postal Code" });
  } else {
    res.send({ lat: locs["LATITUDE"], lng: locs["LONGITUDE"] });
  }
});

module.exports = router;
