const express = require("express");
const { submitContact, getAllContacts } = require("../controllers/contact.controller");

const router = express.Router();

router.post("/", submitContact);
router.get("/", getAllContacts);


module.exports = router;