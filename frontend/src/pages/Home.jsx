import {
    motion,
    useScroll,
    useTransform
} from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import UserCareLayout from "../components/layout/UserCareLayout";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

/* Scroll Reveal Wrapper */
const AnimatedSection = ({ children }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
        >
            {children}
        </motion.div>
    );
};

/* Counter Component */
const Counter = ({ end, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {
        if (!inView) return;

        let start = 0;
        const duration = 1400;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [inView, end]);

    return <div ref={ref}>{count}{suffix}</div>;
};


const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const { scrollY } = useScroll();
    const blobY1 = useTransform(scrollY, [0, 600], [0, -100]);
    const blobY2 = useTransform(scrollY, [0, 600], [0, 100]);

    const [stats, setStats] = useState({
        caregivers: 0,
        families: 0,
        rating: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("/stats");
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);


    return (
        <UserCareLayout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >

                {/* HERO */}
                <section className="relative py-28 mt-2 text-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl">

                    <motion.div
                        style={{ y: blobY1 }}
                        className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-blue-300 rounded-full blur-3xl opacity-20"
                    />

                    <motion.div
                        style={{ y: blobY2 }}
                        className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-indigo-300 rounded-full blur-3xl opacity-20"
                    />

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight relative z-10"
                    >
                        Trusted Elderly Care,
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Right at Your Home
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mt-5 text-slate-600 max-w-2xl mx-auto relative z-10 text-lg"
                    >
                        Professional in-home healthcare services delivered by verified caregivers,
                        ensuring safety, comfort, and peace of mind for your family.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-10 flex justify-center gap-5 relative z-10"
                    >

                        {!token ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate("/login")}
                                className="px-9 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg transition font-semibold"
                            >
                                Get Started Now
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => {
                                    if (role === "caregiver") {
                                        navigate("/caregiver/dashboard");
                                    } else {
                                        navigate("/user/dashboard");
                                    }
                                }}
                                className="px-9 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg transition font-semibold"
                            >
                                {role === "caregiver" ? "Go to Dashboard" : "Go to Dashboard"}
                            </motion.button>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}

                            onClick={() => {
                                if (role === "caregiver") {
                                    navigate("/caregiver/jobs");
                                } else {
                                    navigate("/services");
                                }
                            }}

                            className="px-9 py-4 border border-slate-300 bg-white/70 backdrop-blur-md rounded-xl hover:bg-white transition font-medium"
                        >
                            {role === "caregiver" ? "View Your Jobs" : "Explore Services"}

                        </motion.button>

                    </motion.div>
                </section>


                {/* SERVICES */}
                <AnimatedSection>

                    <div className="text-center mb-3 py-20">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Our Care Services
                        </h2>
                        <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                            Personalized healthcare solutions delivered to your home.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Featured Service */}
                        <div className="md:col-span-2 bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                            <span className="text-4xl">🩺</span>
                            <h3 className="text-2xl font-bold mt-6 text-slate-800 group-hover:text-blue-600 transition-colors">Professional Nursing Care</h3>
                            <p className="text-slate-500 mt-4 text-lg">Post-surgery care, chronic illness management, and medical support in the comfort of your home.</p>
                            <div className="mt-8 h-1 w-20 bg-blue-600 rounded-full group-hover:w-full transition-all duration-500" />
                        </div>

                        {/* Secondary Services */}
                        <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-blue-600/20">
                            <div>
                                <span className="text-4xl">🤝</span>
                                <h3 className="text-2xl font-bold mt-6">Companion Care</h3>
                                <p className="text-blue-100 mt-2">Emotional support, companionship, and daily assistance for a better quality of life.</p>
                            </div>
                        </div>

                        <div className="bg-slate-100 p-10 rounded-[2.5rem] border border-slate-200 hover:bg-white transition-colors">
                            <span className="text-4xl">💪</span>
                            <h3 className="text-xl font-bold mt-6 text-slate-800">Physiotherapy</h3>
                            <p className="text-slate-500 mt-2">Expert-led recovery sessions scheduled at your home.</p>
                        </div>

                        <div className="md:col-span-2 bg-gradient-to-r from-indigo-50 to-blue-50 p-10 rounded-[2.5rem] border border-blue-100 flex flex-col md:flex-row items-center gap-8">
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-bold text-slate-800">Trusted & Verified Care</h3>
                                <p className="text-slate-600 mt-2 text-sm">Every caregiver is background-verified and medically trained.</p>
                            </div>
                            <div className="flex -space-x-4">
                                {/* Aesthetic User Avatars */}
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-300 overflow-hidden shadow-sm" />
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>


                {/* STATS */}
                <AnimatedSection>
                    <section className="py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                                Trusted by Families Across the Country
                            </h2>
                            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                                A growing network built on reliability and trust.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { value: stats.caregivers, suffix: "+", label: "Active Care Professionals" },
                                { value: stats.families, suffix: "+", label: "Happy Families" },
                                { value: stats.rating.toFixed(1), suffix: "⭐", label: "Average Rating" },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -6 }}
                                    className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm hover:shadow-xl text-center transition"
                                >
                                    <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        <Counter end={stat.value} suffix={stat.suffix} />
                                    </h3>
                                    <p className="text-slate-600 mt-3 text-sm uppercase tracking-wide">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </AnimatedSection>


                {/* CARE ECOSYSTEM*/}
                <AnimatedSection>
                    <div className="relative">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
                                How we bridge the <span className="text-blue-600">Care Gap</span>
                            </h2>
                            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
                                A structured approach to ensure your loved ones are never alone,
                                combining clinical excellence with family connectivity.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                            <div className="lg:col-span-7 bg-white rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between overflow-hidden relative group">
                                <div className="relative z-10">
                                    <div className="flex gap-3 mb-8">
                                        {['Safety', 'Comfort', 'Quality'].map((tag) => (
                                            <span key={tag} className="px-4 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-widest">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                                        Real-time Updates <br /> & Compassionate Support
                                    </h3>
                                    <p className="text-slate-500 mt-6 text-lg max-w-md leading-relaxed">
                                        Our platform doesn't just book a visit; it creates a 24/7 safety net.
                                        Stay informed with real-time updates on care activities,
                                        ensuring transparency and peace of mind for families.
                                    </p>
                                </div>

                                <div className="mt-12 flex items-end justify-between relative z-10">
                                    <button
                                        onClick={() => navigate("/services")}
                                        className="group/btn flex items-center gap-3 text-blue-600 font-bold text-lg"
                                    >
                                        Explore Services
                                        <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                                    </button>

                                    <div className="hidden md:flex gap-2 items-end">
                                        {[40, 70, 45, 90, 65, 80].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: h }}
                                                transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse' }}
                                                className="w-3 bg-blue-600/20 rounded-full"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-100 transition-colors" />
                            </div>

                            <div className="lg:col-span-5 flex flex-col gap-6">

                                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white hover:scale-[1.02] transition-transform cursor-pointer shadow-lg overflow-hidden relative">
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-bold">CareNote Tracking</h4>
                                        <p className="text-slate-400 mt-2 text-sm"> Maintain detailed care logs, daily updates, and observations so families stay connected with every step of care.</p>
                                        <div className="flex -space-x-3 mt-6">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                    {i === 3 ? '+Notes' : 'Note'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl font-black">01</div>
                                </div>

                                <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white hover:scale-[1.02] transition-transform cursor-pointer shadow-lg overflow-hidden relative">
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-bold">Family Transparency</h4>
                                        <p className="text-blue-100 mt-2 text-sm">Track care updates, schedules, and service details through a dedicated dashboard.</p>
                                        <div className="mt-6 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '75%' }}
                                                className="h-full bg-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl font-black">02</div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 text-slate-800 hover:scale-[1.02] transition-transform cursor-pointer shadow-sm overflow-hidden relative">
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-bold">Rapid Response</h4>
                                        <p className="text-slate-500 mt-2 text-sm">Emergency assistance is just one tap away from your family and elders.</p>
                                        <div className="mt-4 flex items-center gap-2 text-red-500 font-bold text-xs uppercase">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                            Active Monitoring
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-black text-slate-900">03</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </AnimatedSection>


                {/* CTA */}
                <AnimatedSection>
                    <section className="py-24">
                        <div className="max-w-5xl mx-auto bg-slate-900 text-white rounded-3xl px-10 py-16 text-center relative overflow-hidden shadow-2xl">

                            <motion.div
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
                            />

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold">
                                    Your Loved Ones Deserve
                                    <span className="block text-blue-400">
                                        More Than Just Care.
                                    </span>
                                </h2>

                                <p className="mt-5 text-slate-300 max-w-2xl mx-auto text-lg">
                                    Join families who trust ElderCare for compassionate healthcare.
                                </p>

                                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-5">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => navigate("/services")}
                                        className="px-9 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg"
                                    >
                                        Book a Service
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => navigate("/contact")}
                                        className="px-9 py-3 border border-slate-600 hover:border-blue-400 hover:text-blue-400 rounded-xl font-medium text-slate-300 transition"
                                    >
                                        Contact Us
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </section>
                </AnimatedSection>

            </motion.div>
        </UserCareLayout>
    );
};

export default Home;