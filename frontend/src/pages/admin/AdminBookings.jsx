import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import API from "../../services/api";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchBookings = async () => {
        try {
            const { data } = await API.get("/admin/bookings", {
                params: {
                    status: statusFilter || undefined,
                    search: search || undefined,
                },
            });

            let list = data.data;

            list = list.sort((a, b) =>
                sortOrder === "desc"
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt)
            );

            setBookings(list);
        } catch (error) {
            console.error("Admin bookings error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [statusFilter, search, sortOrder]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await API.put(`/admin/bookings/${id}/status`, { status: newStatus });
            fetchBookings();
        } catch (error) {
            alert(error.response?.data?.message || "Action failed");
        }
    };

    const handleForceCancel = async (id) => {
        try {
            await API.put(`/admin/bookings/${id}/force-cancel`);
            fetchBookings();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800">
                    Booking Management
                </h1>
                <p className="text-sm text-slate-500">
                    Full control over platform bookings
                </p>
            </div>

            <Card>
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <input
                        type="text"
                        placeholder="Search by patient or caregiver..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-md text-sm w-full md:w-1/3"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border px-3 py-2 rounded-md text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="requested">Requested</option>
                        <option value="accepted">Accepted</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border px-3 py-2 rounded-md text-sm"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>
            </Card>

            <div className="h-6" />

            <Card>
                {loading ? (
                    <p className="text-sm text-slate-500">Loading bookings...</p>
                ) : bookings.length === 0 ? (
                    <p className="text-sm text-slate-500">No bookings found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3 text-left">Service</th>
                                    <th className="px-4 py-3 text-left">Patient</th>
                                    <th className="px-4 py-3 text-left">Caregiver</th>
                                    <th className="px-4 py-3 text-left">Start</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3">{booking.serviceId?.name}</td>
                                        <td className="px-4 py-3">{booking.patientId?.name}</td>
                                        <td className="px-4 py-3">
                                            {booking.caregiverId?.userId?.name || "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(booking.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 capitalize">
                                            {booking.status}
                                        </td>
                                        <td className="px-4 py-3 space-x-2">
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="text-xs bg-slate-700 text-white px-2 py-1 rounded"
                                            >
                                                View
                                            </button>
                                            {booking.status !== "completed" && (
                                                <button
                                                    onClick={() =>
                                                        handleStatusUpdate(booking._id, "completed")
                                                    }
                                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                                                >
                                                    Force Complete
                                                </button>
                                            )}
                                            {booking.status !== "cancelled" && (
                                                <button
                                                    onClick={() => handleForceCancel(booking._id)}
                                                    className="text-xs bg-red-600 text-white px-2 py-1 rounded"
                                                >
                                                    Force Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* MODAL */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 relative">
                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="absolute top-3 right-4 text-slate-500"
                        >
                            ×
                        </button>

                        <h2 className="text-lg font-semibold mb-4">
                            Booking Details
                        </h2>

                        <div className="space-y-3 text-sm">

                            <p><strong>Service:</strong> {selectedBooking.serviceId?.name}</p>

                            <p>
                                <strong>Booked By:</strong> {selectedBooking.userId?.name}
                                <span className="text-slate-500 ml-2">
                                    ({selectedBooking.userId?.role})
                                </span>
                            </p>

                            <p>
                                <strong>User Email:</strong> {selectedBooking.userId?.email}
                            </p>

                            <p>
                                <strong>Patient:</strong> {selectedBooking.patientId?.name}
                            </p>

                            <p>
                                <strong>Patient Emergency Contact:</strong>{" "}
                                {selectedBooking.patientId?.emergencyContact || "-"}
                            </p>

                            <p>
                                <strong>Caregiver:</strong>{" "}
                                {selectedBooking.caregiverId?.userId?.name || "-"}
                            </p>

                            <p>
                                <strong>Caregiver Email:</strong>{" "}
                                {selectedBooking.caregiverId?.userId?.email || "-"}
                            </p>

                            <hr className="my-2" />

                            <p><strong>Hours Per Day:</strong> {selectedBooking.hoursPerDay}</p>
                            <p><strong>Duration (Days):</strong> {selectedBooking.durationDays}</p>

                            <p><strong>Start Date:</strong> {new Date(selectedBooking.startDate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(selectedBooking.endDate).toLocaleDateString()}</p>

                            <p><strong>Price Per Hour:</strong> ₹{selectedBooking.pricePerHour}</p>
                            <p><strong>Total Cost:</strong> ₹{selectedBooking.totalCost}</p>

                            <p><strong>Status:</strong> {selectedBooking.status}</p>

                            <p>
                                <strong>Created At:</strong>{" "}
                                {new Date(selectedBooking.createdAt).toLocaleString()}
                            </p>

                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminBookings;