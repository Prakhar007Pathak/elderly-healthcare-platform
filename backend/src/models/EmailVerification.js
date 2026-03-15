const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },

        token: {
            type: String,
            required: true
        },

        verified: {
            type: Boolean,
            default: false
        },

        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600
        }
    }
);

module.exports = mongoose.model("EmailVerification", emailVerificationSchema);