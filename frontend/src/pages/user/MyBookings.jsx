import { useEffect, useState } from "react";
import UserCareLayout from "../../components/layout/UserCareLayout";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import BookingModal from "../../components/ui/BookingModal";
import API from "../../services/api";
import socket from "../../services/socket";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ratingBooking, setRatingBooking] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);

  const [careNotesBooking, setCareNotesBooking] = useState(null);
  const [careNotes, setCareNotes] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings/my");
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to load bookings");
    }
  };

  const fetchCareNotes = async (bookingId) => {
    try {
      const res = await API.get(`/care-notes/${bookingId}`);
      setCareNotes(res.data);
    } catch (error) {
      toast.error("Failed to load care notes");
    }
  };

  useEffect(() => {
    fetchBookings();

    socket.on("booking-updated", (updatedBooking) => {
      setBookings(prev =>
        prev.map(b =>
          b._id === updatedBooking._id ? updatedBooking : b
        )
      );
    });

    return () => {
      socket.off("booking-updated");
    };
  }, []);

  return (
    <UserCareLayout>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            onClick={() => setSelectedBooking(booking)}
            className="cursor-pointer"
          >
            <Card>
              <div className="flex justify-between items-start">

                <div>
                  <h3 className="text-sm font-semibold">
                    {booking.serviceId?.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    Caregiver: {booking.caregiverId?.userId?.name || "-"}
                  </p>

                  <p className="text-xs text-slate-500">
                    Patient: {booking.patientId?.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <StatusBadge status={booking.status} />

                  {/* VIEW CARE NOTES */}
                  {(booking.status === "ongoing" || booking.status === "completed") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCareNotesBooking(booking);
                        fetchCareNotes(booking._id);
                      }}
                      className="text-xs bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                      Care Notes
                    </button>
                  )}

                  {booking.status === "completed" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRatingBooking(booking);
                      }}
                      className="text-xs bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Rate Caregiver
                    </button>
                  )}

                </div>

              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* BOOKING DETAILS MODAL */}
      <BookingModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      {/* CARE NOTES MODAL */}
      {careNotesBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">

            <h3 className="text-lg font-semibold mb-4">
              Care Notes
            </h3>

            {careNotes.length === 0 ? (
              <p className="text-sm text-slate-500">
                No care notes available yet.
              </p>
            ) : (
              <div className="space-y-4">
                {careNotes.map((note) => (
                  <div
                    key={note._id}
                    className="border rounded-lg p-3"
                  >
                    <p className="text-sm font-medium">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>

                    <p className="text-sm mt-1">
                      {note.notes}
                    </p>

                    {note.tasksCompleted?.length > 0 && (
                      <div className="text-xs mt-2">
                        <strong>Tasks:</strong>{" "}
                        {note.tasksCompleted.join(", ")}
                      </div>
                    )}

                    {note.vitals && (
                      <div className="text-xs mt-1 text-slate-500">
                        BP: {note.vitals.bloodPressure || "-"} | Temp: {note.vitals.temperature || "-"} | Pulse: {note.vitals.pulse || "-"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setCareNotesBooking(null);
                  setCareNotes([]);
                }}
                className="px-4 py-1 bg-gray-200 rounded"
              >
                Close
              </button>
            </div>

          </div>

        </div>
      )}

      {/* RATING MODAL */}
      {ratingBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="text-lg font-semibold mb-4">
              Rate Caregiver
            </h3>

            <select
              value={ratingValue}
              onChange={(e) => setRatingValue(Number(e.target.value))}
              className="w-full border p-2 rounded mb-4"
            >
              {[5, 4, 3, 2, 1].map(v => (
                <option key={v} value={v}>
                  {v} Star{v > 1 && "s"}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRatingBooking(null)}
                className="px-3 py-1 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await API.post("/ratings", {
                      bookingId: ratingBooking._id,
                      rating: ratingValue
                    });

                    toast.success("Rating submitted!");
                    setRatingBooking(null);
                  } catch (error) {
                    toast.error(error.response?.data?.message || "Error");
                  }
                }}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </UserCareLayout>
  );
};

export default MyBookings;