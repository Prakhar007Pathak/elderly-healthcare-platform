import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

const AdminCaregivers = () => {
    const [caregivers, setCaregivers] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [selectedCaregiver, setSelectedCaregiver] = useState(null);

    const fetchCaregivers = async () => {
        try {
            const { data } = await API.get("/admin/caregivers");
            setCaregivers(data.data);
        } catch (error) {
            console.error("Caregiver fetch error:", error);
        }
    };

    useEffect(() => {
        fetchCaregivers();
    }, []);

    const handleVerify = async (id) => {
        await API.put(`/admin/caregivers/${id}/verify`);
        fetchCaregivers();
    };

    const handleReject = async (id) => {
        await API.put(`/admin/caregivers/${id}/reject`);
        fetchCaregivers();
    };

    const filtered = caregivers.filter((c) => {
        const matchesSearch =
            c.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.userId?.email?.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "all" || c.verificationStatus === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800">
                    Caregiver Management
                </h1>
            </div>

            <div className="flex gap-4 mb-6">
                <input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded-md text-sm w-64"
                />

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border px-3 py-2 rounded-md text-sm"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Experience</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((c) => (
                            <tr key={c._id} className="border-t">
                                <td className="p-3">{c.userId?.name}</td>
                                <td className="p-3">{c.userId?.email}</td>
                                <td className="p-3">{c.experience || "-"} yrs</td>
                                <td className="p-3 capitalize">{c.verificationStatus}</td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => setSelectedCaregiver(c)}
                                        className="text-xs bg-slate-700 text-white px-3 py-1 rounded"
                                    >
                                        View
                                    </button>

                                    {c.verificationStatus !== "verified" && (
                                        <button
                                            onClick={() => handleVerify(c._id)}
                                            className="text-xs bg-green-600 text-white px-3 py-1 rounded"
                                        >
                                            Approve
                                        </button>
                                    )}

                                    {c.verificationStatus !== "rejected" && (
                                        <button
                                            onClick={() => handleReject(c._id)}
                                            className="text-xs bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Reject
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="p-6 text-center text-slate-500">
                        No caregivers found.
                    </div>
                )}
            </div>

            {/* 🔥 Modal */}
            {selectedCaregiver && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 relative">
                        <button
                            onClick={() => setSelectedCaregiver(null)}
                            className="absolute top-3 right-4 text-slate-500"
                        >
                            ×
                        </button>

                        <h2 className="text-lg font-semibold mb-4">
                            Caregiver Details
                        </h2>

                        <div className="space-y-3 text-sm">

                            <p><strong>Name:</strong> {selectedCaregiver.userId?.name}</p>
                            <p><strong>Email:</strong> {selectedCaregiver.userId?.email}</p>
                            <p><strong>Phone:</strong> {selectedCaregiver.userId?.phone || "-"}</p>

                            <hr />

                            <p><strong>Qualification:</strong> {selectedCaregiver.qualification || "-"}</p>
                            <p><strong>Experience:</strong> {selectedCaregiver.experience} years</p>

                            <p><strong>Specialization:</strong> {selectedCaregiver.specialization?.join(", ") || "-"}</p>
                            <p><strong>Service Areas:</strong> {selectedCaregiver.serviceAreas?.join(", ") || "-"}</p>

                            <p><strong>Availability:</strong> {selectedCaregiver.availability ? "Available" : "Not Available"}</p>
                            <p><strong>Verification:</strong> {selectedCaregiver.verificationStatus}</p>
                            <p><strong>Rating:</strong> ⭐ {selectedCaregiver.rating || 0}</p>

                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};

export default AdminCaregivers;