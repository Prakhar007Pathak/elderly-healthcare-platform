const Rating = require("../models/Rating");
const Booking = require("../models/Booking");
const Caregiver = require("../models/Caregiver");

exports.submitRating = async (req, res) => {
    try {
        const { bookingId, rating } = req.body;

        if (!bookingId || !rating) {
            return res.status(400).json({ message: "Missing fields" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be 1-5" });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Only booking owner
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Only completed bookings
        if (booking.status !== "completed") {
            return res.status(400).json({ message: "Booking not completed yet" });
        }

        // Prevent duplicate rating
        const existingRating = await Rating.findOne({ bookingId });
        if (existingRating) {
            return res.status(400).json({ message: "Rating already submitted" });
        }

        const newRating = await Rating.create({
            bookingId,
            caregiverId: booking.caregiverId,
            userId: req.user.id,
            rating
        });

        // Recalculate caregiver average rating
        const ratings = await Rating.find({
            caregiverId: booking.caregiverId
        });

        const avg =
            ratings.reduce((acc, r) => acc + r.rating, 0) /
            ratings.length;

        await Caregiver.findByIdAndUpdate(booking.caregiverId, {
            rating: avg.toFixed(1)
        });

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: newRating
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};