import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../services/api";
import toast from "react-hot-toast";
import ErrorBox from "../../components/ui/ErrorBox";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "family",
    phone: "",
    gender: "",
    dob: "",
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
      const { data } = await API.post("/auth/register", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("profileCompleted", data.user.profileCompleted);

      toast.success("Account created successfully 🎉");

      redirectUser(data.user.role);

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* LEFT SIDE*/}
      <div className="hidden md:flex w-[65%] relative items-center justify-center text-white overflow-hidden">

        {/* Animated Gradient */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-[length:200%_200%]"
        />

        {/* Floating Blobs */}
        <motion.div
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute w-[28rem] h-[28rem] bg-white/10 rounded-full blur-3xl top-20 left-20"
        />
        <motion.div
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 11, repeat: Infinity }}
          className="absolute w-[28rem] h-[28rem] bg-white/10 rounded-full blur-3xl bottom-20 right-20"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-2xl px-16"
        >
          <h1 className="text-5xl font-extrabold leading-tight">
            Join the Future of
            <br />
            <span className="text-blue-200">
              Compassionate Healthcare
            </span>
          </h1>

          <p className="mt-8 text-lg text-blue-100 leading-relaxed">
            Connect with trusted caregivers, manage healthcare seamlessly,
            and bring peace of mind to your family.
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 md:w-[35%] items-center justify-center bg-slate-50 p-6">

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/40"
        >
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
            Create Account
          </h2>

          <ErrorBox message={errorMessage} />

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">

            {/* NAME */}
            <FloatingInput
              label="Full Name"
              name="name"
              type="text"
              onChange={handleChange}
            />

            {/* EMAIL */}
            <FloatingInput
              label="Email Address"
              name="email"
              type="email"
              onChange={handleChange}
            />

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

            {/* PHONE */}
            <FloatingInput
              label="Phone Number"
              name="phone"
              type="text"
              onChange={handleChange}
            />

            {/* GENDER */}
            <select
              name="gender"
              required
              onChange={handleChange}
              className="w-full border-b-2 border-slate-300 bg-transparent px-1 py-2 focus:outline-none focus:border-blue-600"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {/* DOB */}
            <input
              name="dob"
              type="date"
              required
              onChange={handleChange}
              className="w-full border-b-2 border-slate-300 bg-transparent px-1 py-2 focus:outline-none focus:border-blue-600"
            />

            {/* ROLE */}
            <select
              name="role"
              onChange={handleChange}
              className="w-full border-b-2 border-slate-300 bg-transparent px-1 py-2 focus:outline-none focus:border-blue-600"
            >
              <option value="family">Family</option>
              <option value="elderly">Elderly</option>
              <option value="caregiver">Caregiver</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </motion.button>

          </form>

          <p className="text-sm text-center text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

/* Floating Input Component */
const FloatingInput = ({ label, name, type, onChange }) => (
  <div className="relative">
    <input
      name={name}
      type={type}
      required
      onChange={onChange}
      className="peer w-full border-b-2 border-slate-300 bg-transparent px-1 py-2 focus:outline-none focus:border-blue-600"
    />
    <label className="absolute left-1 top-2 text-slate-500 text-sm transition-all
      peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600
      peer-valid:-top-4 peer-valid:text-xs">
      {label}
    </label>
  </div>
);

export default Register;