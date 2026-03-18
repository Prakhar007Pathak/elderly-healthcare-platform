import { useEffect, useState } from "react";
import UserCareLayout from "../../components/layout/UserCareLayout";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import CaregiverBookingModal from "../../components/ui/CaregiverBookingModal";
import CareNoteModal from "../../components/ui/CareNoteModal";
import API from "../../services/api";
import toast from "react-hot-toast";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [careNoteBookingId, setCareNoteBookingId] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/bookings/my-jobs");
      setJobs(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      setProcessingId(id);
      await API.put(`/bookings/${id}/status`, { status: newStatus });
      await fetchJobs();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <UserCareLayout>
      <h1 className="text-2xl font-semibold mb-6">My Jobs</h1>

      <div className="space-y-6">
        {loading ? (
          <Card>Loading...</Card>
        ) : jobs.length === 0 ? (
          <Card>No jobs assigned yet.</Card>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => setSelectedBooking(job)}
              className="cursor-pointer"
            >
              <Card>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold">
                      {job.serviceId?.name}
                    </h3>

                    <p className="text-xs text-slate-500">
                      Patient: {job.patientId?.name}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={job.status} />

                    {/* START JOB */}
                    {job.status === "accepted" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(job._id, "ongoing");
                        }}
                        disabled={processingId === job._id}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {processingId === job._id
                          ? "Updating..."
                          : "Start Job"}
                      </button>
                    )}

                    {/* ONGOING JOB ACTIONS */}
                    {job.status === "ongoing" && (
                      <>
                        {/* ADD CARE NOTE */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCareNoteBookingId(job._id);
                          }}
                          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                        >
                          Add Care Note
                        </button>

                        {/* MARK COMPLETED */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(job._id, "completed");
                          }}
                          disabled={processingId === job._id}
                          className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {processingId === job._id
                            ? "Updating..."
                            : "Mark Completed"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* BOOKING DETAILS MODAL */}
      <CaregiverBookingModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        refresh={fetchJobs}
      />

      {/* CARE NOTE MODAL */}
      {careNoteBookingId && (
        <CareNoteModal
          bookingId={careNoteBookingId}
          onClose={() => setCareNoteBookingId(null)}
        />
      )}
    </UserCareLayout>
  );
};

export default MyJobs;