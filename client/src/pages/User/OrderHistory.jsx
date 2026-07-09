import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOrderId, setCancelModalOrderId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/my-orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("ORDER FETCH ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${cancelModalOrderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCancelModalOrderId(null);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  // ADDED: disable/enable scroll when modal opens/closes
  useEffect(() => {
    if (cancelModalOrderId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cancelModalOrderId]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed": return "bg-indigo-100 text-indigo-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Shipped": return "bg-purple-100 text-purple-700";
      case "Delivered": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-500 text-white";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading orders...</div>;
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">

      <h1 className="text-4xl text-gray-500 font-bold mb-10 text-center">
        MY ORDERS
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white shadow rounded-2xl p-10 text-center">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            // ADDED: relative on each order card so modal anchors to it
            <div key={order._id} className="relative bg-white shadow rounded-2xl p-6 border">

               <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID: #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {item.bookId?.title || "Book"}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-indigo-600">
                      ₹ {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500">
                    Total Items: {order.items.length}
                  </p>
                  <h2 className="text-2xl font-bold text-green-600">
                    ₹ {order.totalPrice}
                  </h2>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center mt-6 px-0">

                  <div className="-ml-1.5">
                    {order.status !== "Cancelled" && order.status !== "Delivered" && (
                      <button
                        onClick={() => navigate("/order-status", { state: { order } })}
                        className="px-8 py-3 rounded-full border-2 border-slate-300 text-slate-800 font-semibold text-sm hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        View Details
                      </button>
                    )}
                  </div>

                  {order.status === "Order Placed" && (
                    <div className="-mr-2">
                      <button
                        onClick={() => setCancelModalOrderId(order._id)}
                        className="px-8 py-3 rounded-full border-2 border-slate-300 text-slate-800 font-semibold text-sm hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* CHANGED: Modal moved INSIDE each order card with absolute position */}
              {cancelModalOrderId === order._id && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
                  <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      Cancel Order
                    </h2>
                    <p className="text-md mb-6 font-semibold">
                      Are you sure you want to cancel this order?
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={cancelOrder}
                        className="px-6 py-2 border-2 border-slate-300 text-gray-600 rounded-full font-semibold active:bg-rose-300 active:text-white transition cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setCancelModalOrderId(null)}
                        className="px-6 py-2 border-2 border-slate-300 text-gray-600 rounded-full font-semibold active:bg-rose-300 active:text-white transition cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </section>
  );
};

export default OrderHistory;