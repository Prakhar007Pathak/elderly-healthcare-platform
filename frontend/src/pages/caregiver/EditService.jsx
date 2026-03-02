import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserCareLayout from "../../components/layout/UserCareLayout";
import Card from "../../components/ui/Card";
import API from "../../services/api";
import toast from "react-hot-toast";


const EditService = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        pricePerHour: "",
        image: null
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const { data } = await API.get("/services");

                const service = data.find(s => s._id === id);

                if (!service) {
                    alert("Service not found");
                    navigate("/caregiver/services");
                    return;
                }

                setForm({
                    name: service.name,
                    description: service.description,
                    pricePerHour: service.pricePerHour,
                    image: null
                });

            } catch (error) {
                toast.error(error.response?.data?.message || error.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id, navigate]);

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

        if (form.image) {
            formData.append("image", form.image);
        }

        try {
            await API.put(`/services/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Service updated successfully!");
            navigate("/caregiver/services");

        } catch (error) {
            alert(error.response?.data?.message || "Update failed");
        }
    };

    if (loading) {
        return <UserCareLayout>Loading...</UserCareLayout>;
    }

    return (
        <UserCareLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-slate-800">
                    Edit Service
                </h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    <input
                        type="number"
                        name="pricePerHour"
                        value={form.pricePerHour}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Update Service
                    </button>

                </form>
            </Card>
        </UserCareLayout>
    );
};

export default EditService;