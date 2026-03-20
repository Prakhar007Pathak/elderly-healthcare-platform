const Caregiver = require("../models/Caregiver");
const Booking = require("../models/Booking");
const Rating = require("../models/Rating");

const getPlatformStats = async (req, res) => {
    try {
        // 1. Active & Verified Caregivers
        const caregivers = await Caregiver.countDocuments({
            verificationStatus: "verified"
        });

        // 2. Happy Families (unique users with completed bookings)
        const uniqueUsers = await Booking.distinct("userId", {
            status: "completed"
        });

        const families = uniqueUsers.length;

        // 3. Average Rating
        const ratings = await Rating.find();

        let avgRating = 0;
        if (ratings.length > 0) {
            const total = ratings.reduce((sum, r) => sum + r.rating, 0);
            avgRating = (total / ratings.length).toFixed(1);
        }

        res.status(200).json({
            caregivers,
            families,
            rating: Number(avgRating)
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching stats",
            error: error.message
        });
    }
};

module.exports = { getPlatformStats };