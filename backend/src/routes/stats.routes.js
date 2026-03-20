const express = require("express");
const { getPlatformStats } = require("../controllers/stats.controller");

const router = express.Router();

router.get("/", getPlatformStats);

module.exports = router;