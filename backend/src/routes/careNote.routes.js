const express = require("express");
const router = express.Router();

const {
    addCareNote,
    getCareNotes
} = require("../controllers/careNote.controller");

const { protect } = require("../middlewares/auth.middleware");

// caregiver adds note
router.post("/", protect, addCareNote);

// get notes for booking
router.get("/:bookingId", protect, getCareNotes);

module.exports = router;