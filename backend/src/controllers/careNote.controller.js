const CareNote = require("../models/CareNote");
const Booking = require("../models/Booking");

// ================= ADD CARE NOTE =================
exports.addCareNote = async (req, res) => {
    try {

        const { bookingId, notes, tasksCompleted, vitals } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Only allow notes when job is ongoing
        if (booking.status !== "ongoing") {
            return res.status(400).json({
                message: "Care notes can only be added when job is ongoing"
            });
        }

        const careNote = await CareNote.create({
            bookingId,
            caregiverId: booking.caregiverId,
            notes,
            tasksCompleted,
            vitals
        });

        // 🔔 SEND REAL TIME NOTIFICATION TO USER
        if (global.io) {
            global.io.to(booking.userId.toString()).emit("notification", {
                type: "care-note",
                message: "New care note added for your booking",
                bookingId: booking._id,
                careNote
            });
        }

        res.status(201).json(careNote);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ================= GET CARE NOTES =================
exports.getCareNotes = async (req, res) => {
    try {

        const { bookingId } = req.params;

        const notes = await CareNote.find({ bookingId })
            .sort({ createdAt: -1 });

        res.status(200).json(notes);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};