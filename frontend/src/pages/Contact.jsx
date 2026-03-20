import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserCareLayout from "../components/layout/UserCareLayout";

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setSuccess("Message sent successfully!");
            setForm({ name: "", email: "", message: "" });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserCareLayout>
            <div className="min-h-screen pb-24">

                {/* --- HEADER SECTION --- */}
                <section className="pt-32 pb-16 px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-blue-600 font-mono text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                            Get in Touch
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                            How can we <span className="text-slate-300 italic">help?</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                            Whether you're looking for care or have a technical question, our team is ready to assist you.
                        </p>
                    </motion.div>
                </section>

                {/* --- MAIN CONTENT: 2 Column Grid --- */}
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT SIDE: Contact Info / Trust Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                            <h3 className="text-2xl font-bold mb-6">Quick Contact</h3>
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl group-hover:bg-blue-600 transition-colors">📧</div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Email Us</p>
                                        <p className="text-lg font-bold">support@eldercare.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl group-hover:bg-blue-600 transition-colors">📞</div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Call Us</p>
                                        <p className="text-lg font-bold">+91 9999XXXXXX</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
                        </div>

                        <div className="bg-blue-50 rounded-[2.5rem] p-10 border border-blue-100">
                            <h4 className="font-bold text-slate-900 mb-2 italic">Priority Support</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Our medical coordinators are available 24/7 for urgent care inquiries. Typical response time for general messages is under 2 hours.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE: The Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-2xl shadow-slate-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        required
                                        className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="mail@example.com"
                                        required
                                        className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest ml-2">Your Message</label>
                                <textarea
                                    name="message"
                                    rows="6"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Tell us how we can assist you..."
                                    required
                                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg tracking-tight hover:bg-slate-900 shadow-xl shadow-blue-100 hover:shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : "Send Inquiry"}
                            </button>

                            <AnimatePresence>
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-center font-bold text-sm"
                                    >
                                        ✓ {success}
                                    </motion.div>
                                )}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-center font-bold text-sm"
                                    >
                                        ⚠ {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.div>
                </div>
            </div>
        </UserCareLayout>
    );
};

export default Contact;