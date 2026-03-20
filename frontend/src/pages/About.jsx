import { motion } from "framer-motion";
import UserCareLayout from "../components/layout/UserCareLayout";

const About = () => {
    // Animation variants for a cohesive feel
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <UserCareLayout>
            <div className="min-h-screen pb-24">

                {/* --- 1. THE HERO: Bold & Minimal --- */}
                <section className="pt-24 pb-16 px-6 relative overflow-hidden text-center">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-blue-50 blur-[120px] rounded-full -z-10" />

                    <motion.div {...fadeIn}>
                        <span className="text-blue-600 font-mono text-xs tracking-[0.4em] uppercase mb-4 block">
                            About Us
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                            About <br />
                            <span className="text-slate-300">ElderCare.</span>
                        </h1>
                        <p className="mt-8 text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Making elderly care <span className="text-slate-900 font-semibold">accessible, reliable, and compassionate</span> for every family.
                        </p>
                    </motion.div>
                </section>

                {/* --- 2. THE BENTO CORE: Who We Are & What We Offer --- */}
                <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Big Logic Card: Who We Are */}
                    <motion.div
                        {...fadeIn}
                        className="md:col-span-8 bg-slate-950 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl"
                    >
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                                    ElderCare is a platform designed to connect families with trusted caregivers
                                    and professional healthcare services at home. We simplify the process of finding
                                    reliable care while ensuring transparency, safety, and peace of mind.
                                </p>
                            </div>
                            <div className="mt-12 flex items-center gap-4 text-blue-500 font-mono text-xs tracking-widest">
                                <span className="w-8 h-px bg-blue-500" />
                                BUILT FOR FAMILIES
                            </div>
                        </div>
                        {/* Interactive Gradient Background */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-colors duration-700" />
                    </motion.div>

                    {/* Feature: Verified Caregivers */}
                    <motion.div
                        {...fadeIn}
                        className="md:col-span-4 bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100 flex flex-col justify-between group hover:bg-blue-600 transition-colors duration-500"
                    >
                        <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🛡️</div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-white transition-colors">Verified Caregivers</h3>
                            <p className="text-slate-500 text-sm mt-2 group-hover:text-blue-100 transition-colors">
                                Carefully verified to ensure safety, trust, and quality service.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature: In-Home Healthcare */}
                    <motion.div
                        {...fadeIn}
                        className="md:col-span-4 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:shadow-xl transition-all"
                    >
                        <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm mb-6">🏠</div>
                        <h3 className="text-xl font-bold text-slate-900">Healthcare Services</h3>
                        <p className="text-slate-500 text-sm mt-2">Professional nursing and physiotherapy directly at your home.</p>
                    </motion.div>

                    {/* Feature: CareNote System */}
                    <motion.div
                        {...fadeIn}
                        className="md:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden"
                    >
                        <h3 className="text-xl font-bold relative z-10">CareNote™ System</h3>
                        <p className="text-slate-400 text-sm mt-2 relative z-10">Caregivers log daily updates and observations, keeping families informed and connected.</p>
                        <div className="mt-6 flex gap-1 items-end relative z-10">
                            {[20, 40, 30, 60, 40].map((h, i) => (
                                <div key={i} className="w-1 bg-blue-500 rounded-full" style={{ height: h }} />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        {...fadeIn}
                        className="md:col-span-4 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-blue-500 transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-2xl">🔔</span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Live Sync</span>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mt-6">Real-Time Updates</h3>
                            <p className="text-slate-500 text-sm mt-2">
                                Stay informed with instant notifications about bookings, service progress, and care activities.
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* --- 3. MISSION: The Dark Emotional Center --- */}
                <section className="mt-32 px-6">
                    <div className="max-w-5xl mx-auto bg-slate-950 rounded-[4rem] py-24 px-10 text-center relative overflow-hidden">
                        <motion.div {...fadeIn}>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Our Mission</h2>
                            <p className="mt-8 text-slate-400 text-lg md:text-xl leading-[1.8] max-w-3xl mx-auto font-medium">
                                "To ensure that every elderly individual receives the care,
                                attention, and dignity they deserve — <span className="text-blue-500">right at their home.</span>"
                            </p>
                        </motion.div>
                        {/* Decorative background element */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
                    </div>
                </section>

                {/* --- 4. WHY CHOOSE US: Clean Minimalist Grid --- */}
                <section className="mt-32 max-w-6xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-12 border-b border-slate-100 pb-8">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Why Choose Us</h2>
                        <span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest hidden md:block">Trust Metrics</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            "Trusted & Verified Caregivers",
                            "Transparent Service Tracking",
                            "Real-Time Notifications",
                            "Easy Booking Experience"
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -8 }}
                                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    0{index + 1}
                                </div>
                                <p className="text-slate-800 font-bold text-lg leading-snug">
                                    {item}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </div>
        </UserCareLayout>
    );
};

export default About;