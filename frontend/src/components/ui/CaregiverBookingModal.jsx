import { FaTimes } from "react-icons/fa";
import StatusBadge from "./StatusBadge";
import API from "../../services/api";
import toast from "react-hot-toast";

const CaregiverBookingModal = ({ booking, onClose, refresh }) => {
    if (!booking) return null;

    const updateStatus = async (status) => {
        try {
            await API.put(`/bookings/${booking._id}/status`, { status });
            refresh();
            onClose();
        } catch (error) {
            // alert("Status update failed");
            toast.error("Status update failed")
        }
    };

    const handleAccept = async () => {
        try {
            await API.put(`/bookings/${booking._id}/accept`);
            refresh();
            onClose();
        } catch (error) {
            // alert("Accept failed");
            toast.error("Accept failed")
        }
    };

    const handleDecline = async () => {
        try {
            await API.put(`/bookings/${booking._id}/decline`);
            refresh();
            onClose();
        } catch (error) {
            // alert("Decline failed");
            toast.error("Decline failed")
        }
    };

    const formatDuration = () => {
        if (booking.durationDays % 365 === 0)
            return `${booking.hoursPerDay} hrs/day for ${booking.durationDays / 365
                } year(s)`;

        if (booking.durationDays % 30 === 0)
            return `${booking.hoursPerDay} hrs/day for ${booking.durationDays / 30
                } month(s)`;

        if (booking.durationDays % 7 === 0)
            return `${booking.hoursPerDay} hrs/day for ${booking.durationDays / 7
                } week(s)`;

        return `${booking.hoursPerDay} hrs/day for ${booking.durationDays} days`;
    };

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />

            <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400"
                    >
                        <FaTimes />
                    </button>

                    <h2 className="text-lg font-semibold mb-6">
                        Booking Details
                    </h2>

                    <div className="space-y-4 text-sm">

                        <Detail label="Patient Name" value={booking.patientId?.name} />
                        <Detail label="Patient Age" value={booking.patientId?.age} />
                        <Detail label="Emergency Contact" value={booking.patientId?.emergencyContact} />
                        <Detail label="Service" value={booking.serviceId?.name} />
                        <Detail label="Total Duration" value={formatDuration()} />
                        <Detail
                            label="Start Date"
                            value={new Date(booking.startDate).toLocaleDateString()}
                        />
                        <Detail
                            label="End Date"
                            value={new Date(booking.endDate).toLocaleDateString()}
                        />
                        <Detail label="Total Cost" value={`₹${booking.totalCost}`} />

                        <div>
                            <p className="text-xs text-slate-500">Status</p>
                            <StatusBadge status={booking.status} />
                        </div>

                    </div>

                    {/* ACTION BUTTONS */}
                    {booking.status === "requested" && (
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleAccept}
                                className="flex-1 bg-green-600 text-white py-2 rounded"
                            >
                                Accept
                            </button>
                            <button
                                onClick={handleDecline}
                                className="flex-1 bg-red-600 text-white py-2 rounded"
                            >
                                Decline
                            </button>
                        </div>
                    )}

                    {booking.status === "accepted" && (
                        <div className="mt-6">
                            <button
                                onClick={() => updateStatus("ongoing")}
                                className="w-full bg-blue-600 text-white py-2 rounded"
                            >
                                Start Job
                            </button>
                        </div>
                    )}

                    {booking.status === "ongoing" && (
                        <div className="mt-6">
                            <button
                                onClick={() => updateStatus("completed")}
                                className="w-full bg-green-600 text-white py-2 rounded"
                            >
                                Mark Completed
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
        <p className="font-medium">{value || "-"}</p>
    </div>
);

export default CaregiverBookingModal;