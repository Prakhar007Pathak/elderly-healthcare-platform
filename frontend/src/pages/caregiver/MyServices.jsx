import { useEffect, useState } from "react";
import UserCareLayout from "../../components/layout/UserCareLayout";
import Card from "../../components/ui/Card";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyServices = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    const fetchServices = async () => {
        try {
            const { data } = await API.get("/services/my");
            setServices(data);
        } catch (error) {
            toast.error("Failed to load services");
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            await API.delete(`/services/${id}`);
            fetchServices();
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    return (
        <UserCareLayout>
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-slate-800">
                    My Services
                </h1>

                <button
                    onClick={() => navigate("/caregiver/services/add")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Service
                </button>
            </div>

            {services.length === 0 ? (
                <Card>
                    <p className="text-sm text-slate-500">
                        You haven't created any services yet.
                    </p>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <Card key={service._id}>
                            {service.image && (
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-40 object-cover rounded mb-3"
                                />
                            )}

                            <h3 className="text-lg font-semibold text-slate-800">
                                {service.name}
                            </h3>

                            <p className="text-sm text-slate-600 mt-1">
                                ₹{service.pricePerHour}/hour
                            </p>

                            <div className="mt-4 flex gap-2">

                                <button
                                    onClick={() => navigate(`/caregiver/services/${service._id}/edit`)}
                                    className="text-sm bg-blue-600 text-white px-5 py-1 rounded hover:bg-blue-700"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(service._id)}
                                    className="text-sm bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </UserCareLayout>
    );
};

export default MyServices;