const express = require("express");
const { servicePoints } = require("./postnord.controller");
const router = express.Router();

router.post("/service-points", servicePoints);

module.exports = router;
