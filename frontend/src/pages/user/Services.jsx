import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserCareLayout from "../../components/layout/UserCareLayout";
import API from "../../services/api";
import Skeleton from "../../components/ui/Skeleton";
import toast from "react-hot-toast";

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await API.get("/services");
                setServices(data);
            } catch (error) {
                toast.error("Error loading services:");
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const filteredServices = services.filter((service) => {
        const serviceName = service.name?.toLowerCase() || "";
        const caregiverName =
            service.caregiverId?.userId?.name?.toLowerCase() || "";

        return (
            serviceName.includes(search.toLowerCase()) ||
            caregiverName.includes(search.toLowerCase())
        );
    });

    return (
        <UserCareLayout>

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-800">
                    Healthcare Services
                </h1>
                <p className="text-slate-500 mt-2">
                    Professional care services offered by verified caregivers
                </p>

                {/* SEARCH BAR */}
                <div className="mt-6 max-w-md">
                    <input
                        type="text"
                        placeholder="Search service or caregiver..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-[350px] w-full rounded-2xl" />
                    ))
                ) : filteredServices.length === 0 ? (
                    <p className="text-slate-500">
                        No services found.
                    </p>
                ) : (
                    filteredServices.map((service) => (
                        <div
                            key={service._id}
                            onClick={() => navigate(`/services/${service._id}`)}
                            className="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group"
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={
                                        service.image ||
                                        "https://images.unsplash.com/photo-1584515933487-779824d29309"
                                    }
                                    alt={service.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />

                                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
                                    ₹{service.pricePerHour}/hr
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                    {service.name}
                                </h3>

                                <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                                    {service.description || "Professional care service."}
                                </p>

                                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                                    <span>
                                        By {service.caregiverId?.userId?.name || "Caregiver"}
                                    </span>

                                    <span className="flex items-center gap-1 text-yellow-500 font-medium">
                                        ⭐ {service.caregiverId?.rating?.toFixed(1) || "0.0"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </UserCareLayout>
    );
};

export default Services;