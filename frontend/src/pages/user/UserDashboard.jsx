import { useEffect, useState, useMemo } from "react";
import UserCareLayout from "../../components/layout/UserCareLayout";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import API from "../../services/api";
import socket from "../../services/socket";
import toast from "react-hot-toast";


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const STATUS_COLORS = {
  requested: "#facc15",
  accepted: "#3b82f6",
  ongoing: "#8b5cf6",
  completed: "#22c55e",
  cancelled: "#ef4444"
};

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings/my");
      setBookings(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
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

    socket.on("new-booking", (newBooking) => {
      setBookings(prev => [newBooking, ...prev]);
    });

    return () => {
      socket.off("booking-updated");
      socket.off("new-booking");
    };
  }, []);

  /* ---------------- STATS ---------------- */

  const active = bookings.filter(
    b => b.status === "accepted" || b.status === "ongoing"
  ).length;

  const completed = bookings.filter(b => b.status === "completed").length;
  const pending = bookings.filter(b => b.status === "requested").length;

  /* ---------------- SPENDING CALCULATIONS ---------------- */

  const totalSpent = useMemo(() => {
    return bookings
      .filter(b => b.status === "completed")
      .reduce((sum, b) => sum + (b.totalCost || 0), 0);
  }, [bookings]);

  const thisMonthSpent = useMemo(() => {
    const now = new Date();

    return bookings
      .filter(b => {
        const date = new Date(b.createdAt);
        return (
          b.status === "completed" &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, b) => sum + (b.totalCost || 0), 0);
  }, [bookings]);

  const averageCost = completed > 0
    ? Math.round(
      bookings
        .filter(b => b.status === "completed")
        .reduce((sum, b) => sum + b.totalCost, 0) / completed
    )
    : 0;


  /* ---------------- PIE CHART DATA ---------------- */

  const statusData = Object.keys(STATUS_COLORS).map(status => ({
    name: status,
    value: bookings.filter(b => b.status === status).length
  })).filter(item => item.value > 0);

  /* ---------------- MONTHLY TREND DATA ---------------- */

  const monthlyData = useMemo(() => {
    const months = {};

    bookings.forEach(b => {
      const date = new Date(b.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!months[key]) {
        months[key] = 0;
      }

      months[key] += 1;
    });

    return Object.entries(months).map(([key, value]) => ({
      month: key,
      bookings: value
    }));
  }, [bookings]);

  return (
    <UserCareLayout>

      {/* -------- STATS -------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Active Bookings" value={active} />
        <StatCard label="Completed Services" value={completed} />
        <StatCard label="Pending Requests" value={pending} />
      </div>

      {/* -------- SPENDING SUMMARY -------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Spent" value={`₹${totalSpent}`} />
        <StatCard label="This Month" value={`₹${thisMonthSpent}`} />
        <StatCard label="Avg Booking Cost" value={`₹${averageCost}`} />
      </div>

      {/* -------- CHARTS -------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Pie Chart */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Booking Status Distribution
          </h2>

          {statusData.length === 0 ? (
            <p className="text-sm text-slate-500">
              No booking data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Line Chart */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Monthly Booking Trend
          </h2>

          {monthlyData.length === 0 ? (
            <p className="text-sm text-slate-500">
              No booking history available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

      </div>

      {/* -------- RECENT BOOKINGS -------- */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Bookings
        </h2>

        {loading ? (
          <p className="text-sm text-slate-500">
            Loading bookings...
          </p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-slate-500">
            No recent bookings.
          </p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking._id}
                className="border-b pb-2 flex justify-between items-start"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {booking.serviceId?.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    Patient: {booking.patientId?.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {new Date(booking.startDate).toLocaleDateString()}
                  </p>
                </div>

                <span className="text-xs font-medium text-slate-600 capitalize">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

    </UserCareLayout>
  );
};

export default UserDashboard;
