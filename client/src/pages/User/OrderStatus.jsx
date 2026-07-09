import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderStatus = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const order = state?.order;

    if (!order) {
        navigate("/orders");
        return null;
    }

    const getStatusColor = (status) => {
        switch (status) {
            //  Added Order Placed
            case "Order Placed": return "bg-indigo-100 text-indigo-700";
            case "Pending": return "bg-yellow-100 text-yellow-700";
            case "Processing": return "bg-blue-100 text-blue-700";
            case "Shipped": return "bg-purple-100 text-purple-700";
            case "Delivered": return "bg-green-100 text-green-700";
            case "Cancelled": return "bg-red-500 text-white";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusMessage = (status) => {
        switch (status) {
            //  Added Order Placed
            case "Order Placed": return "Your order has been placed successfully!";
            case "Pending": return "Your order is waiting to be processed.";
            case "Processing": return "Your order is currently being processed.";
            case "Shipped": return "Your order has been shipped and is on the way.";
            case "Delivered": return "Your order has been delivered successfully.";
            case "Cancelled": return "Your order has been cancelled.";
            default: return "";
        }
    };

    // Added Order Placed to steps
    const steps = ["Order Placed", "Pending", "Processing", "Shipped", "Delivered"];
    const currentStep = steps.indexOf(order.status);

    return (
        <section className="max-w-2xl mx-auto px-6 py-16">

            <h1 className="text-3xl text-violet-500 font-bold mb-10 text-center"> SEE ALL UPADTES</h1>

            <div className="bg-white rounded-2xl shadow p-8">

                {/* Order Info */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Order ID: #{order._id.slice(-6)}</p>
                        <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        })}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>

                {/* Status Message */}
                <div className="bg-indigo-50 rounded-xl p-4 mb-8">
                    <p className="text-indigo-700 font-medium text-center">
                        {getStatusMessage(order.status)}
                    </p>
                </div>

                {/* Progress Steps — only show if not cancelled */}
                {order.status !== "Cancelled" && (
                    <div className="flex items-center justify-between mb-8">
                        {steps.map((step, index) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index <= currentStep
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-200 text-gray-500"
                                        }`}>
                                        {index < currentStep ? "✓" : index + 1}
                                    </div>
                                    <p className={`text-xs mt-1 font-medium text-center ${index <= currentStep ? "text-indigo-600" : "text-gray-400"
                                        }`}>
                                        {step}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 rounded ${index < currentStep ? "bg-indigo-600" : "bg-gray-200"
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Items */}
                <div className="space-y-4 mb-6">
                    <h3 className="font-bold text-lg">Items</h3>
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-3">
                            <div>
                                <h4 className="font-semibold">{item.bookId?.title || "Book"}</h4>
                                <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-indigo-600">₹ {item.price * item.quantity}</p>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t mb-8">
                    <p className="text-gray-500">Total Items: {order.items.length}</p>
                    <h2 className="text-2xl font-bold text-green-600">₹ {order.totalPrice}</h2>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate("/orders")}
                    className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition cursor-pointer"
                >
                    Back to My Orders
                </button>

            </div>
        </section>
    );
};

export default OrderStatus; 