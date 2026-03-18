const mongoose = require("mongoose");

const careNoteSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caregiver",
      required: true
    },

    notes: {
      type: String,
      required: true
    },

    tasksCompleted: [
      {
        type: String
      }
    ],

    vitals: {
      bloodPressure: String,
      temperature: String,
      pulse: String
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("CareNote", careNoteSchema);