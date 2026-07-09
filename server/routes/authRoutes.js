
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getAllUsers,
    deleteUser,
    updateUserRole,
    sendOtp,
    verifyOtp,
    resetPassword,
    requestAdminAccess,
    acceptAdminRequest,
    rejectAdminRequest
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password/send-otp", sendOtp);
router.post("/forgot-password/verify-otp", verifyOtp);
router.post("/forgot-password/reset-password", resetPassword);

// Accept/Reject admin request (clicked from email link - no auth needed)
router.get("/admin-request/accept/:id", acceptAdminRequest);
router.get("/admin-request/reject/:id", rejectAdminRequest);

// User requests admin access
router.post("/admin-request", authMiddleware, requestAdminAccess);

// Admin-only routes
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/user/:id", authMiddleware, adminMiddleware, deleteUser);
router.put("/user/:id/role", authMiddleware, adminMiddleware, updateUserRole);

module.exports = router;