import { useEffect, useState } from "react";
import UserCareLayout from "../../components/layout/UserCareLayout";
import Card from "../../components/ui/Card";
import CaregiverBookingModal from "../../components/ui/CaregiverBookingModal";
import API from "../../services/api";
import socket from "../../services/socket";
import toast from "react-hot-toast";


const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/bookings/pending");
      setRequests(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    socket.on("new-booking", fetchRequests);
    socket.on("booking-updated", fetchRequests);

    return () => {
      socket.off("new-booking");
      socket.off("booking-updated");
    };
  }, []);

  const handleAccept = async (id, e) => {
    e.stopPropagation();
    try {
      setProcessingId(id);
      await API.put(`/bookings/${id}/accept`);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (id, e) => {
    e.stopPropagation();
    try {
      setProcessingId(id);
      await API.put(`/bookings/${id}/decline`);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <UserCareLayout>
      <h1 className="text-2xl font-semibold mb-6">
        Service Requests
      </h1>

      <div className="space-y-6">
        {loading ? (
          <Card>Loading...</Card>
        ) : requests.length === 0 ? (
          <Card>No pending requests.</Card>
        ) : (
          requests.map((booking) => (
            <div
              key={booking._id}
              onClick={() => setSelectedBooking(booking)}
              className="cursor-pointer"
            >
              <Card>
                <div className="flex justify-between items-center">

                  <div>
                    <h3 className="text-sm font-semibold">
                      {booking.serviceId?.name}
                    </h3>

                    <p className="text-xs text-slate-500">
                      Patient: {booking.patientId?.name}
                    </p>
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={(e) => handleAccept(booking._id, e)}
                      disabled={processingId === booking._id}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {processingId === booking._id ? "..." : "Accept"}
                    </button>

                    <button
                      onClick={(e) => handleDecline(booking._id, e)}
                      disabled={processingId === booking._id}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {processingId === booking._id ? "..." : "Decline"}
                    </button>

                  </div>

                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      <CaregiverBookingModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        refresh={fetchRequests}
      />
    </UserCareLayout>
  );
};

export default Requests;