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
  hasLicensePlate,
  setLicensePlate,
  giveFeedback,
  getFeedback,
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
    const d = await getLevelSlotsfromPPCode(ppcode, level);
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
  if (!id) {
    res.send({
      error: "Please add id.",
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
  if (!id) {
    res.send({ error: "Please add id." });
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

router.post("/setlicenseplate", async function (req, res, next) {
  const { id, platenumber } = req.body;
  if (!id || !platenumber) {
    res.send({ error: "Please add id and/or platenumber." });
  } else {
    const o = await isVacant(id);
    const p = await hasLicensePlate(id);
    if (!o && !p) {
      await setLicensePlate(id, platenumber);
      res.sendStatus(200);
    } else {
      res.send({ error: "There was a problem" });
    }
  }
});

router.post("/feedback", async function (req, res, next) {
  const { id, image, kerb, paint, other, jobStatus, eta } = req.body;
  const ob = { image, kerb, paint, other, jobStatus, eta };
  const j = JSON.stringify(ob);
  const r = await giveFeedback(id, j);
  if (r == 1) {
    res.send("OK");
  } else {
    res.send(r);
  }
});

router.get("/retrievefeedback", async function (req, res, next) {
  const { id } = req.query;
  const r = await getFeedback(id);
  if (r.length > 0) {
    res.send(r);
  } else {
    res.send("There is no feedback");
  }
});

module.exports = router;
