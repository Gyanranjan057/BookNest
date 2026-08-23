import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext";

const Order = () => {

  const [loading, setLoading] = useState(false);

  const { cart, fetchCart } = useCart();

  const token = localStorage.getItem("token");

  // Load Cart
  useEffect(() => {
    fetchCart();
  }, []);

  // Stripe Payment
  const handleCheckout = async () => {

    try {

      if (!token) {
        return alert("Please login first ❌");
      }

      if (!cart || cart.items.length === 0) {
        return alert("Cart is empty ❌");
      }

      setLoading(true);

      const response = await axios.post(
        "srv-da5eqajbc2fs738qle30/api/payment/create-checkout-session",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to Stripe
      window.location.href = response.data.url;

    } catch (error) {

      console.error(
        "PAYMENT ERROR:",
        error.response?.data || error.message
      );

      alert("Payment failed ❌");

    } finally {

      setLoading(false);
    }
  };

  // Total Price
  const totalPrice =
    cart?.items?.reduce((total, item) => {
      return total + (item?.bookId?.price || 0) * item.quantity;
    }, 0) || 0;

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">

      <h1 className="text-3xl font-bold mb-10">
        🧾 Order Summary
      </h1>

      {!cart || cart.items.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-500 text-lg">
            Your cart is empty
          </p>
        </div>

      ) : (

        <div className="bg-white rounded-2xl shadow p-8">

          {/* Cart Items */}
          <div className="space-y-5 mb-8">

            {cart.items.map((item) => (

              <div
                key={item._id}
                className="flex justify-between items-center border-b pb-4"
              >

                <div>
                  <h2 className="font-semibold text-lg">
                    {item?.bookId?.title || "Book"}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-bold text-indigo-600">
                  ₹ {(item?.bookId?.price || 0) * item.quantity}
                </p>

              </div>
            ))}

          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-8">

            <h2 className="text-2xl font-bold">
              Total
            </h2>

            <h2 className="text-3xl font-bold text-green-600">
              ₹ {totalPrice}
            </h2>

          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Redirecting..." : "Proceed to Payment"}
          </button>

        </div>
      )}

    </section>
  );
};

export default Order;