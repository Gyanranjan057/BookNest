const express = require("express");
const router = express.Router();

// Added cancelOrder to import
const { placeOrder, getUserOrder, getAllOrder, updateOrderStatus, cancelOrder } = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, placeOrder);
router.get("/user", authMiddleware, getUserOrder);
router.get("/my-orders", authMiddleware, getUserOrder);
router.get("/all", authMiddleware, adminMiddleware, getAllOrder);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

// Added cancel route
router.put("/:id/cancel", authMiddleware, cancelOrder);

module.exports = router;

