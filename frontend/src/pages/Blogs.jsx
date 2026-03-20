import { useState } from "react";
import { motion } from "framer-motion";
import UserCareLayout from "../components/layout/UserCareLayout";

const Blogs = () => {
    const [blogs] = useState([
        {
            id: 1,
            title: "How to Care for Elderly at Home",
            desc: "Learn essential tips to provide safe and comfortable care for elderly family members at home.",
            date: "March 2026",
            category: "Caregiving",
            readTime: "5 min read"
        },
        {
            id: 2,
            title: "Signs Your Parents Need Professional Care",
            desc: "Understand early signs that indicate your loved ones may need professional healthcare support.",
            date: "March 2026",
            category: "Health",
            readTime: "4 min read"
        },
        {
            id: 3,
            title: "Benefits of In-Home Nursing Services",
            desc: "Discover how in-home healthcare services improve recovery, comfort, and overall well-being.",
            date: "March 2026",
            category: "Services",
            readTime: "6 min read"
        }
    ]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <UserCareLayout>
            <div className="min-h-screen bg-white pb-24">

                {/* --- HERO SECTION --- */}
                <section className="pt-32 pb-16 px-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 -z-10" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <span className="text-blue-600 font-mono text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                            Journal & Insights
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                            Health & <span className="italic text-slate-300">Care.</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                            Expert guidance and heartfelt stories designed to help you navigate the journey of elderly caregiving.
                        </p>
                    </motion.div>
                </section>

                {/* --- BLOG GRID --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
                >
                    {blogs.map((blog) => (
                        <motion.div
                            key={blog.id}
                            variants={itemVariants}
                            className="group cursor-pointer"
                        >
                            <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-8 h-full shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 transition-all duration-500 flex flex-col">

                                {/* Meta Info */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                        {blog.category}
                                    </span>
                                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-2">
                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                        {blog.readTime}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-slate-500 mt-4 leading-relaxed font-medium">
                                        {blog.desc}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-slate-400 text-xs font-mono">
                                        {blog.date}
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>

                                {/* Subtle background glow on hover */}
                                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* --- NEWSLETTER CTA --- */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="max-w-4xl mx-auto mt-32 px-6"
                >
                    <div className="bg-blue-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                        <h2 className="text-3xl font-bold mb-4 relative z-10">Stay updated with Care Tips</h2>
                        <p className="text-blue-100 mb-8 max-w-md mx-auto relative z-10 font-medium">
                            Join our community to receive weekly insights directly in your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-grow px-6 py-4 rounded-2xl bg-white/10 border border-white/20 outline-none focus:bg-white focus:text-slate-900 transition-all placeholder:text-blue-200"
                            />
                            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                                Subscribe
                            </button>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    </div>
                </motion.div>

            </div>
        </UserCareLayout>
    );
};

export default Blogs;