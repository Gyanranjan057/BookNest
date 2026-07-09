 const express = require("express");
const router = express.Router();
const { createCheckoutSession, stripeWebhook } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

module.exports = router;