import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post("https://booknest-r7wv.onrender.com/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onClose();
        window.location.reload();
      } else {
        await axios.post("https://booknest-r7wv.onrender.com/api/auth/register", formData);
        setIsLogin(true);
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // ---- Forgot Password Handlers ----
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://booknest-r7wv.onrender.com/api/auth/forgot-password/send-otp", { email: forgotEmail });
      setForgotMessage(res.data.message);
      setForgotStep(2);
    } catch (error) {
      setForgotMessage(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://booknest-r7wv.onrender.com/api/auth/forgot-password/verify-otp", { email: forgotEmail, otp: forgotOtp });
      setForgotMessage(res.data.message);
      setForgotStep(3);
    } catch (error) {
      setForgotMessage(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("shttps://booknest-r7wv.onrender.com/api/auth/forgot-password/reset-password", { email: forgotEmail, otp: forgotOtp, newPassword });
      setForgotMessage(res.data.message);
      setTimeout(() => {
        setIsForgot(false);
        setForgotStep(1);
        setForgotEmail("");
        setForgotOtp("");
        setNewPassword("");
        setForgotMessage("");
      }, 2000);
    } catch (error) {
      setForgotMessage(error.response?.data?.message || "Reset failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-70"></div>

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-8 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
          onClick={() => {
            onClose();
            setIsForgot(false);
            setForgotStep(1);
            setForgotMessage("");
          }}
        >
          ✕
        </button>

        {/* ---- FORGOT PASSWORD FLOW ---- */}
        {isForgot ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

            {forgotMessage && (
              <p className="text-center text-sm text-green-600 mb-4">{forgotMessage}</p>
            )}

            {/* Step 1 - Enter Email */}
            {forgotStep === 1 && (
              <form className="space-y-4" onSubmit={handleSendOtp}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button type="submit" className="w-full bg-green-700 cursor-pointer text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition">
                  Send OTP
                </button>
              </form>
            )}

            {/* Step 2 - Enter OTP */}
            {forgotStep === 2 && (
              <form className="space-y-4" onSubmit={handleVerifyOtp}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button type="submit" className="w-full bg-green-700 cursor-pointer text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition">
                  Verify OTP
                </button>
              </form>
            )}

             {forgotStep === 3 && (
              <form className="space-y-4" onSubmit={handleResetPassword}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-700 cursor-pointer text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition">
                  Reset Password
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-600 mt-4">
              <button onClick={() => { setIsForgot(false); setForgotStep(1); setForgotMessage(""); }} className="text-green-600 cursor-pointer font-medium hover:underline">
                Back to Login
              </button>
            </p>
          </>
        ) : (
          <>
            {/* ---- LOGIN / REGISTER FLOW ---- */}
            <h2 className="text-2xl font-bold text-center mb-6">
              {isLogin ? "Welcome back!" : "Create an account"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Password with eye toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgot(true)}
                    className="text-sm text-green-600 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-700 cursor-pointer text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition"
              >
                {isLogin ? "Log in" : "Sign up"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 cursor-pointer font-medium ml-1 hover:underline"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;