var express = require("express");
const { getToken } = require("../utils/helper");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/token", async function (req, res, next) {
  const token = (await getToken())["Result"];
  res.cookie("apitoken", token);
  res.send("OK.");
});

module.exports = router;
