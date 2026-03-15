import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../services/api";
import toast from "react-hot-toast";
import ErrorBox from "../../components/ui/ErrorBox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  const [dob, setDob] = useState(null);

  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    let interval;

    if (emailVerifying && formData.email) {
      interval = setInterval(async () => {
        try {
          const { data } = await API.get(
            `/auth/check-verification/${formData.email}`
          );

          if (data.verified) {
            setEmailVerified(true);
            setEmailVerifying(false);
            setVerificationMessage("");
            toast.success("Email verified successfully ✅");
            clearInterval(interval);
          }
        } catch (err) { }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [emailVerifying, formData.email]);

  const handleChange = (e) => {
    setErrorMessage("");

    const { name, value } = e.target;

    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData({
        ...formData,
        phone: cleaned
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleVerifyEmail = async () => {
    if (!formData.email) {
      toast.error("Enter email first");
      return;
    }

    try {
      setEmailVerifying(true);
      setVerificationMessage("Check your mail and verify");

      await API.post("/auth/send-verification", {
        email: formData.email,
      });

      toast.success("Verification email sent 📧");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
      setEmailVerifying(false);
    }
  };

  const redirectUser = (role) => {
    if (role === "admin") navigate("/admin/dashboard");
    else navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      toast.error("Please verify your email first");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Enter a valid 10 digit phone number");
      setLoading(false);
      return;
    }

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

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-[65%] relative items-center justify-center text-white overflow-hidden">
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

            <FloatingInput
              label="Full Name"
              name="name"
              type="text"
              onChange={handleChange}
            />

            {/* EMAIL */}
            <div className="relative">
              <FloatingInput
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
              />

              {!emailVerified && (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="absolute right-0 top-1 px-3 py-1 text-xs rounded-md bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow hover:opacity-90 transition"
                >
                  {emailVerifying ? "Verifying..." : "Verify"}
                </button>
              )}

              {emailVerified && (
                <span className="absolute right-0 top-2 text-green-600 text-sm">
                  ✔
                </span>
              )}
            </div>

            {verificationMessage && (
              <p className="text-xs text-blue-600">
                {verificationMessage}
              </p>
            )}

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
                className="absolute right-0 top-2 text-slate-500 hover:text-blue-600 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <FloatingInput
              label="Phone Number"
              name="phone"
              type="tel"
              maxLength={10}
              onChange={handleChange}
            />

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

            <div className="relative">
              <DatePicker
                selected={dob}
                onChange={(date) => {
                  setDob(date);
                  setFormData({
                    ...formData,
                    dob: date ? date.toISOString().split("T")[0] : "",
                  });
                }}
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                placeholderText="Select your birth date"
                className="w-full border-b-2 border-slate-300 bg-transparent px-1 py-2 focus:outline-none focus:border-blue-600 block"
              />
            </div>

            <div>
              <p className="text-sm text-slate-600 mb-2">Select your role</p>

              <div className="grid grid-cols-3 gap-2">
                {["elderly", "family", "caregiver"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`py-2 text-sm rounded-lg border transition
        ${formData.role === role
                        ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white border-transparent"
                        : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                      }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !emailVerified}
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

const FloatingInput = ({ label, name, type, onChange }) => (
  <div className="relative">
    <input
      name={name}
      type={type}
      required
      onChange={onChange}
      className="peer w-full border-b-2 border-slate-300 bg-transparent px-1 py-2 
focus:outline-none focus:border-blue-600 
transition-all duration-200 
focus:shadow-[0_4px_12px_rgba(37,99,235,0.15)]"
    />
    <label className="absolute left-1 top-2 text-slate-500 text-sm transition-all
      peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600
      peer-valid:-top-4 peer-valid:text-xs">
      {label}
    </label>
  </div>
);

export default Register;