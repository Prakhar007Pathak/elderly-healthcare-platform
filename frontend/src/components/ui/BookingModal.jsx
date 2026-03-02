import { FaTimes } from "react-icons/fa";
import StatusBadge from "./StatusBadge";
import API from "../../services/api";
import toast from "react-hot-toast";

const BookingModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const canCancel =
        booking.status === "requested" ||
        booking.status === "accepted";

    const handleCancel = async () => {
        try {
            await API.put(`/bookings/${booking._id}/cancel`);
            onClose();
        } catch (error) {
            toast.error("Unable to cancel booking")
        }
    };

    return (
        <>
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border p-6 relative">

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                    >
                        <FaTimes />
                    </button>

                    <h2 className="text-lg font-semibold mb-6">
                        Booking Details
                    </h2>

                    <div className="space-y-4 text-sm">

                        <Detail label="Service" value={booking.serviceId?.name} />

                        <Detail
                            label="Caregiver"
                            value={booking.caregiverId?.userId?.name}
                        />

                        <Detail
                            label="Patient"
                            value={booking.patientId?.name}
                        />

                        <Detail
                            label="Start Date"
                            value={new Date(booking.startDate).toLocaleDateString()}
                        />

                        <Detail
                            label="End Date"
                            value={booking.endDate
                                ? new Date(booking.endDate).toLocaleDateString()
                                : "-"}
                        />

                        <Detail
                            label="Duration"
                            value={`${booking.durationDays} days`}
                        />

                        <div>
                            <p className="text-xs text-slate-500">Status</p>
                            <StatusBadge status={booking.status} />
                        </div>

                        <Detail
                            label="Service Price"
                            value={`₹${booking.pricePerHour}`}
                        />

                        <Detail
                            label="Total Cost"
                            value={`₹${booking.totalCost}`}
                        />

                    </div>

                    {canCancel && (
                        <div className="mt-6">
                            <button
                                onClick={handleCancel}
                                className="w-full py-2 bg-red-600 text-white rounded-lg"
                            >
                                Cancel Booking
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

const Detail = ({ label, value }) => (
    <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">
            {value || "-"}
        </p>
    </div>
);

export default BookingModal;