import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/contact");
                const data = await res.json();
                setContacts(data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };

        fetchContacts();
    }, []);

    const truncateMessage = (text, limit = 80) => {
        if (!text) return "";
        return text.length > limit ? text.slice(0, limit) + "..." : text;
    };

    return (
        <DashboardLayout>
            <div className="p-6">

                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                    Contact Messages
                </h1>

                <div className="space-y-4">
                    {contacts.length === 0 ? (
                        <p className="text-slate-500">No messages yet.</p>
                    ) : (
                        contacts.map((c) => (
                            <div
                                key={c._id}
                                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
                            >
                                {/* Top */}
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-800">
                                        {c.name}
                                    </h3>
                                    <span className="text-xs text-slate-400">
                                        {new Date(c.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                {/* Email */}
                                <p className="text-sm text-blue-600 mt-1">
                                    {c.email}
                                </p>

                                {/* Message Preview */}
                                <div className="flex justify-between items-center mt-3">
                                    <p className="text-slate-600 text-sm pr-4">
                                        {truncateMessage(c.message)}
                                    </p>

                                    <button
                                        onClick={() => setSelected(c)}
                                        className="text-blue-600 text-sm font-medium hover:underline"
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 🔥 MODAL */}
                {selected && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative">

                            {/* Close */}
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute top-3 right-4 text-slate-400 hover:text-slate-700 text-xl"
                            >
                                ✕
                            </button>

                            <h2 className="text-xl font-bold text-slate-800 mb-4">
                                Message Details
                            </h2>

                            <p className="text-sm text-slate-500 mb-2">
                                <strong>Name:</strong> {selected.name}
                            </p>

                            <p className="text-sm text-slate-500 mb-2">
                                <strong>Email:</strong> {selected.email}
                            </p>

                            <p className="text-sm text-slate-500 mb-4">
                                <strong>Date:</strong>{" "}
                                {new Date(selected.createdAt).toLocaleString()}
                            </p>

                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap break-words">
                                {selected.message}
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default AdminContacts;