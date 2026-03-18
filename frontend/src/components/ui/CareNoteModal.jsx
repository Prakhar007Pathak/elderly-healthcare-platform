import { useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

const CareNoteModal = ({ bookingId, onClose }) => {
    const [notes, setNotes] = useState("");
    const [bloodPressure, setBloodPressure] = useState("");
    const [temperature, setTemperature] = useState("");
    const [pulse, setPulse] = useState("");
    const [tasksCompleted, setTasksCompleted] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const tasks = tasksCompleted
                .split(",")
                .map((task) => task.trim())
                .filter(Boolean);

            await API.post("/care-notes", {
                bookingId,
                notes,
                tasksCompleted: tasks,
                vitals: {
                    bloodPressure,
                    temperature,
                    pulse
                }
            });

            toast.success("Care note added successfully");

            onClose();

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to add care note"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

                <h2 className="text-lg font-semibold">
                    Add Care Note
                </h2>

                <textarea
                    placeholder="Write care notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border rounded-md p-2"
                />

                <input
                    placeholder="Blood Pressure"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="w-full border rounded-md p-2"
                />

                <input
                    placeholder="Temperature"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full border rounded-md p-2"
                />

                <input
                    placeholder="Pulse"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full border rounded-md p-2"
                />

                <input
                    placeholder="Tasks completed (comma separated)"
                    value={tasksCompleted}
                    onChange={(e) => setTasksCompleted(e.target.value)}
                    className="w-full border rounded-md p-2"
                />

                <div className="flex justify-end gap-2">

                    <button
                        onClick={onClose}
                        className="px-3 py-1 bg-gray-200 rounded-md"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-1 bg-blue-600 text-white rounded-md"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default CareNoteModal;