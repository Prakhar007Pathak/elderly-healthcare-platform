import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const baseUserMenu = [
    { label: "Profile", path: "/user/profile" },
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Book Service", path: "/services" },
    { label: "My Bookings", path: "/user/bookings" }
];

const familyMenu = [
    { label: "Profile", path: "/user/profile" },
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Manage Patients", path: "/user/manage-patients" },
    { label: "Book Service", path: "/services" },
    { label: "My Bookings", path: "/user/bookings" }
];

const menus = {
    family: familyMenu,
    elderly: baseUserMenu,
    caregiver: [
        { label: "Profile", path: "/caregiver/profile" },
        { label: "Dashboard", path: "/caregiver/dashboard" },
        { label: "My Services", path: "/caregiver/services" },
        { label: "Requests", path: "/caregiver/requests" },
        { label: "My Jobs", path: "/caregiver/jobs" }
    ]
};



const ProfileDrawer = ({ open, onClose }) => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const items = menus[role] || [];


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("onboardingDismissed");
        navigate("/");
    };


    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (open) {
            document.addEventListener("keydown", handleEsc);
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [open, onClose]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 backdrop-blur-sm bg-black/20 z-40 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />


            {/* Drawer */}
            <div
                className={`fixed right-6 top-1/3 -translate-y-1/2 w-80 bg-white z-50 shadow-2xl rounded-2xl transform transition-all duration-300 ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
                    }`}
                style={{ height: "520px" }}
            >


                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-red-500 transition"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center px-6 pb-6">
                    <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-semibold mb-3">
                        {name?.charAt(0).toUpperCase()}

                    </div>


                    <h3 className="text-base font-semibold text-slate-800">
                        {name || "User"}
                    </h3>

                </div>

                <hr />

                {/* Navigation Section */}
                <div className="px-6 py-4 space-y-2">
                    {items.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                onClose();
                            }}
                            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-slate-100 transition"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <hr />

                {/* Logout Section */}
                <div className="px-6 py-4">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 rounded hover:bg-red-50 transition"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </>
    );
};

export default ProfileDrawer;
