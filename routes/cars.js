var express = require("express");
var router = express.Router();
var { getActualCarparks } = require("../utils/carpark");

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.cookies?.apitoken) {
    res.send("Cars.");
  } else {
    res.send("Please get your token.");
  }
});

router.get("/all", async function (req, res, next) {
  if (req.cookies?.apitoken) {
    const result = (await getActualCarparks(req.cookies?.apitoken))["Result"];
    console.log(result);
    res.send(result);
  } else {
    res.send("Please get your token.");
  }
});

module.exports = router;
