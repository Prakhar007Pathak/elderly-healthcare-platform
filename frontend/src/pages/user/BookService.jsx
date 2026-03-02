import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserCareLayout from "../../components/layout/UserCareLayout";
import Card from "../../components/ui/Card";
import API from "../../services/api";
import toast from "react-hot-toast";

const BookService = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();

  const { service, hours, durationDays, totalCost } = location.state || {};

  const [patients, setPatients] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await API.get("/patients/my");
        setPatients(data);

        if (role === "elderly" && data.length > 0) {
          setPatientId(data[0]._id);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Something went wrong");
      }
    };

    fetchPatients();
  }, [role]);

  if (!service) return null;

  const calculatedEndDate =
    startDate && durationDays
      ? new Date(
        new Date(startDate).setDate(
          new Date(startDate).getDate() + durationDays
        )
      )
        .toISOString()
        .split("T")[0]
      : "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      toast.error("Please select patient")
      return;
    }

    try {
      await API.post("/bookings", {
        patientId,
        serviceId: service._id,
        startDate,
        hoursPerDay: hours,
        durationDays,
      });

      toast.success("Booking created successfully!")
      navigate("/user/bookings");

    } catch (error) {
      toast.error(error.response?.data);
      toast.error(error.response?.data?.message || "Booking failed")
    }
  };

  return (
    <UserCareLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Confirm Booking
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">

          {role === "family" && (
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          <div className="p-2 bg-slate-100 rounded">
            {service.name}
          </div>

          <div className="w-full">
            <label className="block mb-1 font-medium text-gray-700">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {calculatedEndDate && (
            <div className="p-2 bg-slate-100 rounded">
              End Date: {calculatedEndDate}
            </div>
          )}

          <div className="p-2 font-semibold">
            Total Cost: ₹{totalCost}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            Book Now
          </button>

        </form>
      </Card>
    </UserCareLayout>
  );
};

export default BookService;