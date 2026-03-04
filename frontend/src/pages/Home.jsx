import {
    motion,
    useScroll,
    useTransform
} from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import UserCareLayout from "../components/layout/UserCareLayout";
import { useNavigate } from "react-router-dom";

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

const testimonials = [
    {
        name: "Anita Sharma",
        text: "ElderCare gave us peace of mind. The caregiver was professional and compassionate. Truly life-changing service.",
    },
    {
        name: "Rahul Mehta",
        text: "The booking process was seamless and transparent. My father received excellent physiotherapy support at home.",
    },
    {
        name: "Priya Kapoor",
        text: "Reliable, trustworthy and highly professional. I would recommend ElderCare to every family.",
    },
];

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const [current, setCurrent] = useState(0);

    const { scrollY } = useScroll();
    const blobY1 = useTransform(scrollY, [0, 600], [0, -100]);
    const blobY2 = useTransform(scrollY, [0, 600], [0, 100]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
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
                            Powered by Compassion & Technology
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mt-5 text-slate-600 max-w-2xl mx-auto relative z-10 text-lg"
                    >
                        Premium in-home healthcare services delivered by verified professionals,
                        ensuring safety, trust and peace of mind.
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
                    <section className="py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Our Care Services
                            </h2>
                            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                                Personalized healthcare solutions delivered to your home.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Nursing Care", desc: "Professional in-home nursing services.", icon: "🩺" },
                                { title: "Elderly Assistance", desc: "Compassionate daily support.", icon: "🤝" },
                                { title: "Physiotherapy", desc: "Personalized therapy sessions.", icon: "💪" },
                            ].map((service, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -8 }}
                                    className="relative bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl transition"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center text-xl rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-5">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                                        {service.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
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
                                { value: 500, suffix: "+", label: "Verified Caregivers" },
                                { value: 1200, suffix: "+", label: "Families Served" },
                                { value: 98, suffix: "%", label: "Satisfaction Rate" },
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

                {/* TESTIMONIALS */}
                <AnimatedSection>
                    <section className="py-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                                What Families Say
                            </h2>
                            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                                Real stories from trusted families.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="bg-white p-10 rounded-2xl shadow-md border"
                            >
                                <p className="text-slate-600 text-lg italic">
                                    "{testimonials[current].text}"
                                </p>
                                <h4 className="mt-6 font-semibold text-blue-600">
                                    — {testimonials[current].name}
                                </h4>
                            </motion.div>

                            <div className="flex justify-center mt-6 gap-2">
                                {testimonials.map((_, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setCurrent(index)}
                                        className={`w-3 h-3 rounded-full cursor-pointer transition ${current === index
                                            ? "bg-blue-600"
                                            : "bg-slate-300"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
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
                                        className="px-9 py-3 border border-slate-600 hover:border-blue-400 hover:text-blue-400 rounded-xl font-medium text-slate-300 transition"
                                    >
                                        Talk to an Expert
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