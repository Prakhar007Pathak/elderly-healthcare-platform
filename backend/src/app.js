const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const caregiverRoutes = require('./routes/caregiver.routes');
const patientRoutes = require('./routes/patient.routes');
const bookingRoutes = require('./routes/booking.routes');
const serviceRoutes = require('./routes/service.routes');
const errorHandler = require('./middlewares/error.middleware');
const adminRoutes = require('./routes/admin.routes');
const ratingRoutes = require("./routes/rating.routes");
const careNoteRoutes = require("./routes/careNote.routes");
const statsRoutes = require("./routes/stats.routes");
const contactRoutes = require("./routes/contact.routes");


const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://eldercare-delta.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/care-notes", careNoteRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/contact", contactRoutes);

// === error handler
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Elderly Healthcare API is running');
});

module.exports = app;