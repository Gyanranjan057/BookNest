const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

//  Added deliveryDetails schema
const deliveryDetailsSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  landmark: { type: String },
  pincode: { type: String },
  state: { type: String },
  deliveryType: { type: String, enum: ["home", "office"], default: "home" }
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    // Default is now "Order Placed"
    status: {
      type: String,
      enum: ["Order Placed", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Order Placed"
    },
    //  Added deliveryDetails field
    deliveryDetails: deliveryDetailsSchema,
    orderDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);


