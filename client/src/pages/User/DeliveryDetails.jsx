import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeliveryDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
    state: "",
    deliveryType: "home",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address || !form.pincode || !form.state) {
      alert("Please fill all required fields ❌");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Save delivery details for order creation
      localStorage.setItem("deliveryDetails", JSON.stringify(form));

      // Create Stripe checkout session
      const response = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Payment error:", error);
      navigate("/payment-failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-10 text-center">
        ADD DELIVERY ADDRESS
      </h1>

      <div className="bg-white rounded-2xl shadow p-8 space-y-6">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your full address"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Landmark */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nearest Landmark
          </label>
          <input
            type="text"
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            placeholder="Enter nearest landmark"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Pincode + State */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Enter state"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Delivery Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Delivery Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setForm({ ...form, deliveryType: "home" })}
              className={`flex-1 py-3 rounded-xl border-2 font-semibold transition cursor-pointer ${
                form.deliveryType === "home"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setForm({ ...form, deliveryType: "office" })}
              className={`flex-1 py-3 rounded-xl border-2 font-semibold transition cursor-pointer ${
                form.deliveryType === "office"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              🏢 Office
            </button>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer mt-4"
        >
          {loading ? "Redirecting to Payment..." : "Proceed to Payment"}
        </button>
      </div>
    </section>
  );
};

export default DeliveryDetails;