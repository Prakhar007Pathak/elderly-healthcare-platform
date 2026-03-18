import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserCareLayout from "../../components/layout/UserCareLayout";
import Card from "../../components/ui/Card";
import API from "../../services/api";
import toast from "react-hot-toast";

const PublicCaregiverProfile = () => {
    const { id } = useParams();
    const [caregiver, setCaregiver] = useState(null);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get(`/caregivers/public/${id}`);
                setCaregiver(data.caregiver);
                setServices(data.services);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong"
                );
            }
        };

        fetchProfile();
    }, [id]);

    if (!caregiver) return null;

    return (
        <UserCareLayout>

            {/* HEADER */}
            <div className="mb-10 bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            {caregiver.userId?.name}

                            {caregiver.verificationStatus === "verified" && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    ✔ Verified
                                </span>
                            )}
                        </h1>

                        <div className="flex items-center gap-6 mt-3 text-sm text-slate-600">

                            <span className="flex items-center gap-1 text-yellow-500 font-medium">
                                ⭐ {caregiver.rating?.toFixed(1) || "0.0"}
                            </span>

                            <span>
                                {caregiver.experience || 0} years experience
                            </span>

                        </div>
                    </div>

                </div>
            </div>

            {/* PROFESSIONAL DETAILS */}
            <Card>
                <h2 className="text-xl font-semibold mb-6">
                    Professional Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">

                    <div>
                        <p className="font-medium text-slate-800 mb-1">
                            Qualification
                        </p>
                        <p>
                            {caregiver.qualification || "Not specified"}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium text-slate-800 mb-1">
                            Specialization
                        </p>
                        <p>
                            {caregiver.specialization?.length > 0
                                ? caregiver.specialization.join(", ")
                                : "Not specified"}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium text-slate-800 mb-1">
                            Service Areas
                        </p>
                        <p>
                            {caregiver.serviceAreas?.length > 0
                                ? caregiver.serviceAreas.join(", ")
                                : "Not specified"}
                        </p>
                    </div>

                </div>
            </Card>

            {/* SERVICES */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">
                    Services Offered
                </h2>

                {services.length === 0 ? (
                    <p className="text-slate-500">
                        No services available.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group"
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

                                    {/* Rating (same style as Services page) */}
                                    <div className="flex items-center justify-end text-xs text-slate-500 mt-2">
                                        <span className="flex items-center gap-1 text-yellow-500 font-medium">
                                            ⭐ {caregiver.rating?.toFixed(1) || "0.0"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>

        </UserCareLayout>
    );
};

export default PublicCaregiverProfile;