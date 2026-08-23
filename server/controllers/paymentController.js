const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.createCheckoutSession = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.bookId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.bookId.title,
        },
        unit_amount: item.bookId.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://booknest-c.onrender.com/payment-success",
      cancel_url: "https://booknest-c.onrender.com/payment-failed",
      metadata: { userId: req.user.id.toString() },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: "Session creation failed", error: error.message });
  }
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;

    try {
      const cart = await Cart.findOne({ userId }).populate("items.bookId");

      if (cart && cart.items.length > 0) {
        // FIXED: using totalPrice to match Order model schema
        await Order.create({
          userId,
          items: cart.items.map((item) => ({
            bookId: item.bookId._id,
            quantity: item.quantity,
            price: item.bookId.price,
          })),
          totalPrice: session.amount_total / 100, 
          status: "Pending",                        
        });

        await Cart.findOneAndDelete({ userId });  
      }
    } catch (err) {
      console.error("Order creation failed:", err.message);
    }
  }

  res.json({ received: true });
};


 