import ProfileDrawer from "./ProfileDrawer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const UserHeader = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    const navItems = [
        { label: "Home", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Blogs", path: "/blogs" },
        { label: "Contact", path: "/contact" },
        { label: "About", path: "/about" },
    ];

    return (
        <>
            <header
                className={`sticky top-0 z-50 h-20 flex items-center justify-between px-4 md:px-10 transition-all duration-300 backdrop-blur-md ${scrolled
                    ? "bg-white/85 shadow-[0_6px_30px_rgba(0,0,0,0.08)]"
                    : "bg-white/70"
                    }`}
            >
                {/* LEFT SECTION */}
                <div className="w-10 md:hidden flex justify-start">
                    <button
                        onClick={() => setMobileMenu(true)}
                        className="text-xl text-slate-700"
                    >
                        <FaBars />
                    </button>
                </div>

                {/* LOGO CENTERED ON MOBILE */}
                <div
                    onClick={() => navigate("/")}
                    className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 cursor-pointer"
                >
                    <img
                        src="/ElderCareLogo.png"
                        alt="ElderCare"
                        className="h-14 md:h-16 w-auto object-contain"
                    />
                </div>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex flex-1 justify-center space-x-10 text-sm font-medium text-slate-600">
                    {navItems.map((item) => (
                        <div
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="relative cursor-pointer group"
                        >
                            <span className="transition-colors group-hover:text-blue-600">
                                {item.label}
                            </span>
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                        </div>
                    ))}
                </nav>

                {/* RIGHT SECTION */}
                <div className="w-10 md:w-auto flex justify-end">
                    {token ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setOpen(true)}
                            className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center shadow-md"
                        >
                            {name?.charAt(0).toUpperCase()}
                        </motion.button>
                    ) : (
                        <div className="flex gap-2 md:gap-4 items-center">
                            <button
                                onClick={() => navigate("/login")}
                                className="text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 transition"
                            >
                                Login
                            </button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate("/register")}
                                className="px-3 py-1.5 md:px-5 md:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs md:text-sm shadow-md"
                            >
                                Sign Up
                            </motion.button>
                        </div>
                    )}
                </div>
            </header>

            {/* MOBILE DRAWER */}
            <AnimatePresence>
                {mobileMenu && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenu(false)}
                            className="fixed inset-0 bg-black/40 z-40 md:hidden"
                        />

                        {/* FULL SCREEN MOBILE MENU */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.25 }}
                            className="fixed top-0 left-0 w-full h-screen bg-white z-50 p-6 md:hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-10">
                                <span className="font-bold text-slate-800 text-lg">
                                    Explore
                                </span>

                                <FaTimes
                                    className="cursor-pointer text-slate-500 hover:text-red-500 transition"
                                    onClick={() => setMobileMenu(false)}
                                />
                            </div>

                            {/* CENTERED NAV LINKS */}
                            <div className="flex flex-col items-center flex-1 space-y-5 text-lg font-medium text-slate-700">
                                {navItems.map((item) => (
                                    <div
                                        key={item.label}
                                        onClick={() => {
                                            navigate(item.path);
                                            setMobileMenu(false);
                                        }}
                                        className="cursor-pointer hover:text-blue-600 transition"
                                    >
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ProfileDrawer open={open} onClose={() => setOpen(false)} />
        </>
    );
};

export default UserHeader;