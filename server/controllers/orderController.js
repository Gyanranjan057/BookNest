
const Cart = require("../models/cart");
const Order = require("../models/order");
const Book = require("../models/book");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.bookId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const totalPrice = cart.items.reduce((total, item) => {
      return total + (item.bookId?.price || 0) * item.quantity;
    }, 0);

    const order = await Order.create({
      userId: req.user.id,
      items: cart.items.map((item) => ({
        bookId: item.bookId._id,
        quantity: item.quantity,
        price: item.bookId.price,
      })),
      totalPrice: totalPrice,
      status: "Order Placed",
      deliveryDetails: req.body.deliveryDetails || null,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order failed",
      error: error.message
    });
  }
};

// USER ORDER HISTORY
exports.getUserOrder = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.bookId");
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// GET ALL ORDERS (Admin)
exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.bookId", "title price image");
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

//  ADMIN UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    // Fetch the existing order first
    const existingOrder = await Order.findById(req.params.id);

    if (!existingOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check if it was already Delivered to prevent double stock decrease
    const wasAlreadyDelivered = existingOrder.status === "Delivered";

    //  Update the status
    existingOrder.status = req.body.status;
    await existingOrder.save();

    //  Only decrease stock if status is NOW Delivered AND was NOT already Delivered
    if (req.body.status === "Delivered" && !wasAlreadyDelivered) {
      for (const item of existingOrder.items) {
         const book = await Book.findById(item.bookId);
        if (book) {
           book.stock = Math.max(0, book.stock - item.quantity);

          //  Auto set isAvailable = false when stock hits 0
          if (book.stock === 0) {
            book.isAvailable = false;
          }

           await book.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: existingOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message
    });
  }
};

// CANCEL ORDER
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "Order Placed" && order.status !== "Pending" && order.status !== "Processing") {
      return res.status(400).json({ success: false, message: "This order cannot be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message
    });
  }
};