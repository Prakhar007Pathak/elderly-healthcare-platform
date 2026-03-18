import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../services/api";
import toast from "react-hot-toast";
import ErrorBox from "../../components/ui/ErrorBox";
import { connectSocket } from "../../services/socket";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setErrorMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const redirectUser = (role) => {
    if (role === "admin") navigate("/admin/dashboard");
    else navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data } = await API.post("/auth/login", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("userId", data.user.id);

      connectSocket();

      toast.success("Welcome back 👋");

      redirectUser(data.user.role);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* LEFT SIDE (65%) — UNTOUCHED DESIGN */}
      <div className="hidden md:flex w-[65%] relative items-center justify-center text-white overflow-hidden">

        {/* Animated Gradient */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-[length:200%_200%]"
        />

        {/* Floating Blobs */}
        <motion.div
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-20 left-20"
        />
        <motion.div
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-20 right-20"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-2xl px-16"
        >
          <h1 className="text-5xl font-extrabold leading-tight">
            Redefining Elderly Care
            <br />
            <span className="text-blue-200">
              Through Technology & Trust
            </span>
          </h1>

          <p className="mt-8 text-lg text-blue-100 leading-relaxed">
            Secure access to verified caregivers,
            seamless booking, and complete peace of mind —
            all in one intelligent platform.
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE (35%) */}
      <div className="flex flex-1 md:w-[35%] items-center justify-center bg-slate-50 p-6">

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/40"
        >
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
            Welcome Back
          </h2>

          <ErrorBox message={errorMessage} />

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">

            {/* EMAIL */}
            <div className="relative">
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                className="peer w-full border-b-2 border-slate-300 bg-transparent px-1 py-2 focus:outline-none focus:border-blue-600"
              />
              <label className="absolute left-1 top-2 text-slate-500 text-sm transition-all 
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 
                peer-valid:-top-4 peer-valid:text-xs">
                Email Address
              </label>
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                onChange={handleChange}
                className="peer w-full border-b-2 border-slate-300 bg-transparent px-1 py-2 focus:outline-none focus:border-blue-600"
              />
              <label className="absolute left-1 top-2 text-slate-500 text-sm transition-all 
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 
                peer-valid:-top-4 peer-valid:text-xs">
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-2 text-xs text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <p className="text-sm text-center text-slate-600 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;