import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
      // Authorization: `Bearer ${token}`,
    },
  };

  // Fetch Cart
  const fetchCart = async () => {
    try {
      const res = await axios.get("https://booknest-r7wv.onrender.com/api/cart", config);
      setCart(res.data.data);
    } catch (error) {
      console.error("Fetch Cart Error:", error);
    }
  };

  //  Add to Cart
  const addToCart = async (bookId, quantity) => {
    try {
      await axios.post(
        "https://booknest-r7wv.onrender.com/api/cart/add",
        { bookId, quantity },
        config,
      );
      fetchCart();
    } catch (error) {
      console.error("Add Cart Error:", error);
    }
  };

  //  Update Quantity
  const updateQuantity = async (bookId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(
        "https://booknest-r7wv.onrender.com/api/cart/update",
        { bookId, quantity },
        config
      );
      fetchCart();
    } catch (error) {
      console.error("Update Cart Error:", error);
    }
  };

  //  Remove Item
  const removeFromCart = async (bookId) => {
    try {
      await axios.delete(
        `https://booknest-r7wv.onrender.com/api/cart/remove/${bookId}`,
        config
      );
      fetchCart();
    } catch (error) {
      console.error("Remove Cart Error:", error);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  //  Cart Count
  const cartCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const clearCart = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart, addToCart, updateQuantity, removeFromCart, cartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);