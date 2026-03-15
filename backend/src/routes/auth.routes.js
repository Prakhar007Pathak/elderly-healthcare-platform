const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getMe,
    updateProfile,
    verifyEmail,
    sendVerification,
    checkEmailVerification
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/send-verification", sendVerification);
router.get("/check-verification/:email", checkEmailVerification);

router.post("/register", register);
router.post("/login", login);

router.get("/verify-email/:token", verifyEmail);

router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);



module.exports = router;
