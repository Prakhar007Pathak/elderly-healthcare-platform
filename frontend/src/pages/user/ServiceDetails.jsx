import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserCareLayout from "../../components/layout/UserCareLayout";
import API from "../../services/api";
import toast from "react-hot-toast";

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [hours, setHours] = useState(1);
    const [durationDays, setDurationDays] = useState(7);

    const [profileCompleted, setProfileCompleted] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const { data } = await API.get("/services");
                const selected = data.find((s) => s._id === id);
                setService(selected);
            } catch (error) {
                toast.error(error.response?.data?.message || error.message || "Something went wrong");
            }
        };

        const checkProfile = async () => {
            try {
                const { data } = await API.get("/auth/me");
                setProfileCompleted(data.profileCompleted);
            } catch (err) { }
        };

        fetchService();
        checkProfile();
    }, [id]);

    if (!service) return null;

    const totalDays = durationDays;
    const totalCost = service.pricePerHour * hours * totalDays;

    return (
        <UserCareLayout>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* LEFT SIDE */}
                <div>
                    <img
                        src={
                            service.image ||
                            "https://images.unsplash.com/photo-1584515933487-779824d29309"
                        }
                        alt={service.name}
                        className="w-full h-80 object-cover rounded-2xl shadow"
                    />

                    <h2 className="text-3xl font-bold mt-6 text-slate-800">
                        {service.name}
                    </h2>

                    <p className="text-slate-600 mt-4 leading-relaxed">
                        {service.description || "Professional healthcare service."}
                    </p>

                    <div className="mt-6 flex items-center justify-between">

                        <div>
                            <div className="text-sm text-slate-500">
                                Offered by
                            </div>

                            <div className="font-semibold text-slate-800">
                                {service.caregiverId?.userId?.name}
                            </div>

                            <div className="text-yellow-500 text-sm mt-1">
                                ⭐ {service.caregiverId?.rating?.toFixed(1) || "0.0"} Rating
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (service?.caregiverId?._id) {
                                    navigate(`/caregiver/public/${service.caregiverId._id}`);
                                }
                            }}
                            className="text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg"
                        >
                            View Profile
                        </button>

                    </div>

                </div>

                {/* RIGHT SIDE - BOOKING CONFIG */}
                <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">

                    <h3 className="text-xl font-semibold mb-6">
                        Schedule Your Care
                    </h3>

                    {/* Hours */}
                    <div className="mb-5">
                        <label className="text-sm text-slate-600">
                            Hours per Day
                        </label>
                        <select
                            value={hours}
                            onChange={(e) => setHours(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded-lg"
                        >
                            {[1, 2, 3, 4, 5, 6].map((h) => (
                                <option key={h} value={h}>
                                    {h} hour(s)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Duration */}
                    <div className="mb-6">
                        <label className="text-sm text-slate-600">
                            Duration
                        </label>

                        <select
                            value={durationDays}
                            onChange={(e) => setDurationDays(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded-lg"
                        >
                            <option value={7}>1 week</option>
                            <option value={14}>2 weeks</option>
                            <option value={21}>3 weeks</option>
                            <option value={30}>1 month</option>
                            <option value={90}>3 months</option>
                            <option value={180}>6 months</option>
                            <option value={365}>1 year</option>
                        </select>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t pt-4 mb-6 text-sm text-slate-600">
                        <div className="flex justify-between mb-2">
                            <span>Price per hour</span>
                            <span>₹{service.pricePerHour}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Total days</span>
                            <span>{totalDays}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg text-slate-800 mt-4">
                            <span>Total Cost</span>
                            <span>₹{totalCost}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const token = localStorage.getItem("token");

                            if (!token) {
                                navigate("/login");
                                return;
                            }

                            //  BLOCK IF PROFILE NOT COMPLETE
                            if (!profileCompleted) {
                                toast.error("Complete your profile before booking");
                                return;
                            }

                            navigate("/user/book", {
                                state: {
                                    service,
                                    hours,
                                    durationDays,
                                    totalCost
                                }
                            });
                        }}
                        disabled={!profileCompleted}
                        className={`w-full py-3 rounded-xl transition font-medium 
                        ${!profileCompleted
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        Proceed to Booking
                    </button>
                </div>

            </div>
        </UserCareLayout>
    );
};

export default ServiceDetails;