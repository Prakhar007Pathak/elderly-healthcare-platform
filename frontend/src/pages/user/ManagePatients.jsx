import { useEffect, useState } from "react";
import UserCareLayout from "../../components/layout/UserCareLayout";
import Card from "../../components/ui/Card";
import API from "../../services/api";
import toast from "react-hot-toast";


const ManagePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "",
        medicalConditions: "",
        mobilityStatus: "",
        emergencyContact: ""
    });

    const fetchPatients = async () => {
        try {
            const { data } = await API.get("/patients/my");
            setPatients(data);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...form,
                medicalConditions: form.medicalConditions
                    ? form.medicalConditions.split(",")
                    : []
            };

            if (editingId) {
                await API.put(`/patients/${editingId}`, payload);
            } else {
                await API.post("/patients", payload);
            }

            setForm({
                name: "",
                age: "",
                gender: "",
                medicalConditions: "",
                mobilityStatus: "",
                emergencyContact: ""
            });

            setEditingId(null);
            fetchPatients();

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save patient");
        }
    };


    return (
        <UserCareLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800">
                    Manage Patients
                </h1>
                <p className="text-sm text-slate-500">
                    Add and manage your family members
                </p>
            </div>

            {/* Add Patient Form */}
            <Card>
                <h2 className="text-lg font-semibold mb-4">
                    Add Patient
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    <input
                        name="age"
                        type="number"
                        placeholder="Age"
                        value={form.age}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                    <input
                        name="mobilityStatus"
                        placeholder="Mobility Status"
                        value={form.mobilityStatus}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        name="emergencyContact"
                        placeholder="Emergency Contact"
                        value={form.emergencyContact}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        name="medicalConditions"
                        placeholder="Medical Conditions (comma separated)"
                        value={form.medicalConditions}
                        onChange={handleChange}
                        className="border p-2 rounded md:col-span-2"
                    />

                    <button
                        type="submit"
                        className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {editingId ? "Update Patient" : "Add Patient"}
                    </button>


                </form>
            </Card>

            <div className="h-8" />

            {/* Patient List */}
            <div className="space-y-4">
                {loading ? (
                    <p>Loading...</p>
                ) : patients.length === 0 ? (
                    <Card>
                        <p className="text-sm text-slate-500">
                            No patients added yet.
                        </p>
                    </Card>
                ) : (
                    patients.map((patient) => (
                        <Card key={patient._id}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-slate-800">
                                        {patient.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Age: {patient.age}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Gender: {patient.gender}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingId(patient._id);
                                        setForm({
                                            name: patient.name,
                                            age: patient.age,
                                            gender: patient.gender,
                                            medicalConditions: patient.medicalConditions?.join(","),
                                            mobilityStatus: patient.mobilityStatus,
                                            emergencyContact: patient.emergencyContact
                                        });
                                    }}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>

                            </div>
                        </Card>
                    ))
                )}
            </div>

        </UserCareLayout>
    );
};

export default ManagePatients;
