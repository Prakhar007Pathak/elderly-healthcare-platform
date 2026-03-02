import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const { data } = await API.get("/admin/users");
            setUsers(data.data);
        } catch (error) {
            console.error("User fetch error:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800">
                    User Management
                </h1>
            </div>

            <input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded-md text-sm w-64 mb-6"
            />

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Patients</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u) => (
                            <tr key={u._id} className="border-t">
                                <td className="p-3">{u.name}</td>
                                <td className="p-3">{u.email}</td>
                                <td className="p-3 capitalize">{u.role}</td>
                                <td className="p-3">{u.phone || "-"}</td>
                                <td className="p-3">{u.patients?.length || 0}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => setSelectedUser(u)}
                                        className="text-xs bg-slate-700 text-white px-3 py-1 rounded"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="p-6 text-center text-slate-500">
                        No users found.
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 relative">
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-3 right-4 text-slate-500"
                        >
                            ×
                        </button>

                        <h2 className="text-lg font-semibold mb-4">
                            User Details
                        </h2>

                        <div className="space-y-3 text-sm">
                            <p><strong>Name:</strong> {selectedUser.name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone || "-"}</p>
                            <p><strong>Role:</strong> {selectedUser.role}</p>
                            <p><strong>Address:</strong> {selectedUser.address || "-"}</p>
                            <p><strong>DOB:</strong> {selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : "-"}</p>

                            <hr />

                            <h3 className="font-semibold">Patients:</h3>

                            {selectedUser.patients?.length > 0 ? (
                                selectedUser.patients.map((p) => (
                                    <div key={p._id} className="border p-2 rounded-md">
                                        <p><strong>Name:</strong> {p.name}</p>
                                        <p><strong>Age:</strong> {p.age}</p>
                                        <p><strong>Emergency Contact:</strong> {p.emergencyContact || "-"}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500">No patients found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};

export default AdminUsers;