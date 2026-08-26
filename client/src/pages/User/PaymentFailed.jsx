import React from "react";
import axios from "axios"; 

const PaymentFailed = () => {

   const handleTryAgain = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://booknest-r7wv.onrender.com/api/payment/create-checkout-session",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.url;
    } catch (error) {
      alert("Failed to restart payment. Please try again.");
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-32 text-center">
      <div className="text-7xl mb-6">❌</div>
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Payment Failed!
      </h1>
      <p className="text-gray-600 mb-6">
        Something went wrong with your payment. Please try again.
      </p>
    </section>
  );
};

export default PaymentFailed;