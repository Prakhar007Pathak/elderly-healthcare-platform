const express = require("express");
const router = express.Router();

const { submitRating } = require("../controllers/rating.controller");
const { protect, allowRoles } = require("../middlewares/auth.middleware");

router.post(
    "/",
    protect,
    allowRoles("family", "elderly"),
    submitRating
);

module.exports = router;