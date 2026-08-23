import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const [message, setMessage] = useState("Processing your order...");
  const orderPlaced = useRef(false);

  useEffect(() => {
    if (orderPlaced.current) return;
    orderPlaced.current = true;

    const placeOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const cartRes = await axios.get(
          "https://booknest-r7wv.onrender.com/api/cart",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const cart = cartRes.data.data;

        if (!cart || cart.items.length === 0) {
          setMessage("Order already placed!");
          setTimeout(() => navigate("/orders"), 3000);
          return;
        }

        const totalPrice = cart.items.reduce((total, item) => {
          return total + (item.bookId?.price || 0) * item.quantity;
        }, 0);

         const deliveryDetails = JSON.parse(localStorage.getItem("deliveryDetails") || "{}");

        await axios.post(
          "https://booknest-r7wv.onrender.com/api/orders",
          {
            totalPrice,
            deliveryDetails 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

         localStorage.removeItem("deliveryDetails");

        setMessage("Order placed successfully!");
        fetchCart();
        setTimeout(() => navigate("/orders"), 3000);

      } catch (error) {
        console.error("Order placement error:", error);
        setMessage("Order placed!");
        setTimeout(() => navigate("/orders"), 3000);
      }
    };

    placeOrder();
  }, []);

  return (
    <section className="max-w-md mx-auto px-6 py-32 text-center">
      <div className="text-7xl mb-6">✅</div>
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p className="text-gray-600 mb-2">{message}</p>
      <p className="text-gray-400 text-sm">
        Redirecting to your orders.....
      </p>
    </section>
  );
};

export default PaymentSuccess;