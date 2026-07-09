import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [showPriceDetail, setShowPriceDetail] = useState(false);

  if (!cart || cart.items.length === 0) {
    return <p className="text-center py-20 text-gray-500">Cart is empty</p>;
  }

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.bookId.price * item.quantity,
    0,
  );

  //  Changed: navigate to delivery details instead of Stripe directly
  const handlePayment = () => {
    navigate("/delivery-details");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-8">🛒 Your Cart</h1>

      <div className="space-y-6">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-xl shadow"
          >
            <div className="flex items-center gap-6">
              <img
                src={item.bookId?.image}
                alt=""
                className="w-20 h-28 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.bookId?.title}</h3>
                <p className="text-gray-500">₹ {item.bookId?.price}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="font-medium">Qty:</span>
                <button
                  onClick={() => updateQuantity(item.bookId._id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 font-bold cursor-pointer text-lg flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.bookId._id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 font-bold cursor-pointer text-lg flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.bookId._id)}
                className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-300 text-sm px-6 py-2 rounded-full cursor-pointer transition mt-4 ml-14"
              >
                ✕ Remove
              </button>
            </div>
          </div>
        ))}

        {showPriceDetail && (
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-bold text-lg mb-4">Price Details</h3>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.bookId?.title}</span>
                  <span>{item.quantity} × ₹{item.bookId?.price} = ₹{item.quantity * item.bookId?.price}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>₹ {totalPrice}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4 text-right">Total: ₹ {totalPrice}</h2>
          <div>
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={() => setShowPriceDetail(!showPriceDetail)}
                className="cursor-pointer bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
              >
                {showPriceDetail ? "Hide Price Details" : "View Price Details"}
              </button>

              {/* Changed: goes to delivery details page */}
              <button
                onClick={handlePayment}
                className="cursor-pointer bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;