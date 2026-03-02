import { useEffect, useState } from "react";
import UserCareLayout from "../../components/layout/UserCareLayout";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import API from "../../services/api";
import toast from "react-hot-toast";


import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const CaregiverDashboard = () => {
  const [pending, setPending] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, jobsRes, analyticsRes] = await Promise.all([
          API.get("/bookings/pending"),
          API.get("/bookings/my-jobs"),
          API.get("/bookings/caregiver-analytics")
        ]);

        setPending(pendingRes.data);
        setJobs(jobsRes.data);
        setAnalytics(analyticsRes.data);

      } catch (error) {
        toast.error("Dashboard error:");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <UserCareLayout>
        <div className="text-sm text-slate-500">
          Loading dashboard...
        </div>
      </UserCareLayout>
    );
  }

  const pendingCount = pending.length;
  const activeCount = jobs.filter(
    j => j.status === "accepted" || j.status === "ongoing"
  ).length;

  const completedCount = jobs.filter(
    j => j.status === "completed"
  ).length;

  const statusData = {
    labels: analytics?.statusStats.map(s => s._id) || [],
    datasets: [
      {
        data: analytics?.statusStats.map(s => s.count) || [],
        backgroundColor: [
          "#F59E0B",
          "#3B82F6",
          "#8B5CF6",
          "#10B981",
          "#EF4444"
        ]
      }
    ]
  };

  const monthlyData = {
    labels: analytics?.monthlyStats.map(
      m => `${m._id.month}/${m._id.year}`
    ) || [],
    datasets: [
      {
        label: "Bookings",
        data: analytics?.monthlyStats.map(m => m.count) || [],
        backgroundColor: "#3B82F6"
      }
    ]
  };

  return (
    <UserCareLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">
          Caregiver Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Overview of your performance & activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Bookings" value={analytics?.totalBookings || 0} />
        <StatCard label="Pending Requests" value={pendingCount} />
        <StatCard label="Active Jobs" value={activeCount} />
        <StatCard label="Completed Jobs" value={completedCount} />
      </div>

      {/* Earnings */}
      <div className="mb-8">
        <Card>
          <h2 className="text-lg font-semibold mb-2">
            Total Earnings
          </h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{analytics?.totalEarnings || 0}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Booking Status Distribution
          </h2>
          <Doughnut data={statusData} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Monthly Booking Trend
          </h2>
          <Bar data={monthlyData} />
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">
          Recent Requests
        </h2>

        {pending.length === 0 ? (
          <p className="text-sm text-slate-500">
            No pending requests.
          </p>
        ) : (
          <div className="space-y-3 text-sm">
            {pending.slice(0, 3).map((booking) => (
              <div
                key={booking._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {booking.serviceId?.name} –{" "}
                  {booking.patientId?.name}
                </span>

                <span className="text-yellow-600 font-medium">
                  Requested
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

    </UserCareLayout>
  );
};

export default CaregiverDashboard;