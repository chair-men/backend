var express = require("express");
var router = express.Router();
var {
  getSlotsfromPPCode,
  getLevelSlotsfromPPCode,
  getVacantSlotsFromPPCode,
  getOccupiedSlotsFromPPCode,
  isVacant,
  setOccupied,
  setVacant,
} = require("../utils/database");

router.get("/", async function (req, res, next) {
  if (!req.query?.ppcode) {
    res.send({ error: "Please add ppcode as param" });
  } else {
    const d = await getSlotsfromPPCode(req.query.ppcode);
    res.send(d);
  }
});

router.get("/level", async function (req, res, next) {
  const { ppcode, level } = req.query;
  if (!ppcode || !level) {
    res.send({ error: "Please add ppcode and/or level as param" });
  } else {
    const d = await getLevelSlotsfromPPCode(req.query.ppcode, level);
    res.send(d);
  }
});

// Vacant and Occupied based on carpark code
router.get("/vacant", async function (req, res, next) {
  if (!req.query?.ppcode) {
    res.send({ error: "Please add ppcode as param" });
  } else {
    const d = await getVacantSlotsFromPPCode(req.query.ppcode);
    res.send(d);
  }
});

router.get("/occupied", async function (req, res, next) {
  if (!req.query?.ppcode) {
    res.send({ error: "Please add ppcode as param" });
  } else {
    const d = await getOccupiedSlotsFromPPCode(req.query.ppcode);
    res.send(d);
  }
});

router.post("/occupy", async function (req, res, next) {
  const { id } = req.body;
  if (!ppcode || !level || !lotnumber) {
    res.send({
      error: "Please add ppcode, level and/or lotnumber to body.",
    });
  } else {
    const o = await isVacant(id);
    if (!o) {
      res.send({ error: "Lot has been occupied" });
    } else if (o.code) {
      res.sendStatus(400);
    } else if ((await setOccupied(id)) == 1) {
      res.sendStatus(200);
    }
  }
});

router.post("/vacate", async function (req, res, next) {
  const { id } = req.body;
  if (!ppcode || !level || !lotnumber) {
    res.send({ error: "Please add ppcode, level and/or lotnumber to body." });
  } else {
    const o = await isVacant(id);
    if (o) {
      res.send({ error: "Lot is already vacant" });
    } else if (o.code) {
      res.sendStatus(400);
    } else if ((await setVacant(id)) == 1) {
      res.sendStatus(200);
    }
  }
});

module.exports = router;
