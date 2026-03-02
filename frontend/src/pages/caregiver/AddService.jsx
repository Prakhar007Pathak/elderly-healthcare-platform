import { useState } from "react";
import UserCareLayout from "../../components/layout/UserCareLayout";
import Card from "../../components/ui/Card";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddService = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        pricePerHour: "",
        image: null
    });

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setForm({ ...form, image: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("pricePerHour", form.pricePerHour);
        formData.append("image", form.image);

        try {
            await API.post("/services", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("Service created successfully!")
            navigate("/caregiver/services");

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create service")
        }
    };

    return (
        <UserCareLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-slate-800">
                    Add New Service
                </h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="text-sm text-slate-600">Service Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-600">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-600">Price Per Hour (₹)</label>
                        <input
                            type="number"
                            name="pricePerHour"
                            value={form.pricePerHour}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-600">Service Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            className="w-full mt-1"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Create Service
                    </button>

                </form>
            </Card>
        </UserCareLayout>
    );
};

export default AddService;