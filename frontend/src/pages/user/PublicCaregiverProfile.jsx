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
                toast.error(error.response?.data?.message || error.message || "Something went wrong");
            }
        };

        fetchProfile();
    }, [id]);

    if (!caregiver) return null;

    return (
        <UserCareLayout>

            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-800">
                    {caregiver.userId?.name}
                </h1>

                <div className="text-yellow-500 mt-2">
                    ⭐ {caregiver.rating?.toFixed(1) || "0.0"} Rating
                </div>

                <div className="text-slate-600 mt-2">
                    {caregiver.experience || 0} years experience
                </div>
            </div>

            <Card>
                <h2 className="text-xl font-semibold mb-6">
                    Services Offered
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(service => (
                        <div
                            key={service._id}
                            className="border rounded-lg p-4"
                        >
                            <div className="font-semibold">
                                {service.name}
                            </div>

                            <div className="text-sm text-slate-500">
                                ₹{service.pricePerHour}/hr
                            </div>
                        </div>
                    ))}
                </div>

            </Card>

        </UserCareLayout>
    );
};

export default PublicCaregiverProfile;