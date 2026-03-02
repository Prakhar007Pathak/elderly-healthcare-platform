import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import API from "../../services/api";

import {
  Bar,
  Pie,
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/analytics")
        ]);

        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);

      } catch (error) {
        console.error("Admin dashboard error:", error);
      }
    };

    fetchData();
  }, []);

  if (!stats || !analytics) {
    return (
      <DashboardLayout>
        <div className="text-sm text-slate-500">
          Loading admin analytics...
        </div>
      </DashboardLayout>
    );
  }

  // Bookings Per Month
  const bookingsPerMonthData = {
    labels: analytics.bookingsPerMonth.map(b =>
      monthNames[b._id - 1]
    ),
    datasets: [{
      label: "Bookings",
      data: analytics.bookingsPerMonth.map(b => b.count),
      backgroundColor: "#3b82f6"
    }]
  };

  // Status Distribution
  const statusData = {
    labels: analytics.statusDistribution.map(
      s => s._id.charAt(0).toUpperCase() + s._id.slice(1)
    ),
    datasets: [{
      data: analytics.statusDistribution.map(s => s.count),
      backgroundColor: [
        "#facc15",
        "#3b82f6",
        "#8b5cf6",
        "#22c55e",
        "#ef4444"
      ]
    }]
  };

  // Revenue Trend
  const revenueData = {
    labels: analytics.revenueTrend.map(r =>
      monthNames[r._id - 1]
    ),
    datasets: [{
      label: "Revenue",
      data: analytics.revenueTrend.map(r => r.revenue),
      borderColor: "#22c55e",
      backgroundColor: "#22c55e",
      tension: 0.3
    }]
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Platform-wide performance overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Caregivers" value={stats.totalCaregivers} />
        <StatCard label="Verified Caregivers" value={stats.verifiedCaregivers} />
        <StatCard label="Total Bookings" value={stats.totalBookings} />
        <StatCard label="Completed" value={stats.completedBookings} />
        <StatCard label="Revenue" value={`₹${stats.totalRevenue || 0}`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Monthly Bookings
          </h2>
          <Bar data={bookingsPerMonthData} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Booking Status Distribution
          </h2>
          <Pie data={statusData} />
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Revenue Trend
          </h2>
          <Line data={revenueData} />
        </Card>

      </div>

    </DashboardLayout>
  );
};

export default AdminDashboard;