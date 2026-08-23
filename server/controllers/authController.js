const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ================= MAILER HELPER =================
const sendMail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let userRole = "user";
        let isRootAdmin = false;

        // Only admin can create admin
        if (req.user && req.user.role === "admin" && role === "admin") {
            userRole = "admin";
        }

         const userCount = await User.countDocuments();
        if (userCount === 0) {
            userRole = "admin";
            isRootAdmin = true;
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            isRootAdmin
        });

        res.status(201).json({
            success: true,
            message: `${userRole} registered successfully`,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isRootAdmin: user.isRootAdmin
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isRootAdmin: user.isRootAdmin
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

// ================= GET ALL USERS (ADMIN) =================
exports.getAllUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);

        let users;
        if (currentUser.isRootAdmin) {
             users = await User.find().select("-password");
        } else {
             users = await User.find({
                $or: [
                    { _id: req.user._id },
                    { isRootAdmin: true }
                ]
            }).select("-password");
        }

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

// ================= DELETE USER (ADMIN) =================
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Cannot delete root admin
        if (user.isRootAdmin) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete root admin"
            });
        }

        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete failed"
        });
    }
};

// ================= UPDATE ROLE (ROOT ADMIN ONLY) =================
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const currentUser = await User.findById(req.user._id);

         if (!currentUser.isRootAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only root admin can change roles"
            });
        }

        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Cannot change root admin's own role
        if (targetUser.isRootAdmin) {
            return res.status(400).json({
                success: false,
                message: "Cannot change root admin role"
            });
        }

        // Cannot change your own role
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own role"
            });
        }

        targetUser.role = role;
        targetUser.adminRequestPending = false;
        await targetUser.save();

        res.status(200).json({
            success: true,
            data: {
                id: targetUser._id,
                name: targetUser.name,
                email: targetUser.email,
                role: targetUser.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Update failed"
        });
    }
};

// ================= REQUEST ADMIN ACCESS =================
exports.requestAdminAccess = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Already an admin"
            });
        }

        if (user.adminRequestPending) {
            return res.status(400).json({
                success: false,
                message: "Request already pending"
            });
        }

        user.adminRequestPending = true;
        await user.save();

         const rootAdmin = await User.findOne({ isRootAdmin: true });

        if (!rootAdmin) {
            return res.status(500).json({
                success: false,
                message: "Root admin not found. Please contact support."
            });
        }

        const acceptUrl = `srv-da5eqajbc2fs738qle30/api/auth/admin-request/accept/${user._id}`;
        const rejectUrl = `srv-da5eqajbc2fs738qle30/api/auth/admin-request/reject/${user._id}`;

        await sendMail(
            rootAdmin.email,
            "Book HUB - Admin Access Request",
            `
            <h2>Admin Access Request</h2>
            <p><b>${user.name}</b> (${user.email}) has requested admin access.</p>
            <br/>
            <a href="${acceptUrl}" style="background:green;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;margin-right:10px;">Accept</a>
            <a href="${rejectUrl}" style="background:red;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reject</a>
            `
        );

        res.status(200).json({
            success: true,
            message: "Request sent to root admin"
        });

    } catch (error) {
        console.error("Admin request error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to send request"
        });
    }
};

// ================= ACCEPT ADMIN REQUEST =================
exports.acceptAdminRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.role = "admin";
        user.adminRequestPending = false;
        await user.save();

        await sendMail(
            user.email,
            "Book HUB - Admin Access Accepted",
            `
            <h2>Congratulations ${user.name}!</h2>
            <p>Your admin access request has been accepted.</p>
            <p>You can now login using your email and password to access the admin panel.</p>
            `
        );

        res.send(`
            <h2> Admin access granted to ${user.name}.</h2>
            <p>A confirmation email has been sent to ${user.email}.</p>
        `);

    } catch (error) {
        res.status(500).send("Failed to accept request");
    }
};

// ================= REJECT ADMIN REQUEST =================
exports.rejectAdminRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.adminRequestPending = false;
        await user.save();

        await sendMail(
            user.email,
            "Book HUB - Admin Access Rejected",
            `
            <h2>Hello ${user.name},</h2>
            <p>Your admin access request has been rejected.</p>
            <p>You can continue using BookNest as a regular user.</p>
            `
        );

        res.send(`
            <h2> Admin access rejected for ${user.name}.</h2>
            <p>A notification email has been sent to ${user.email}.</p>
        `);

    } catch (error) {
        res.status(500).send("Failed to reject request");
    }
};

// ================= SEND OTP =================
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);

        user.resetOtp = otp;
        user.resetOtpExpiry = expiry;
        await user.save();

        await sendMail(
            email,
            "Book HUB - Password Reset OTP",
            `<h2>Your OTP is: <b>${otp}</b></h2><p>Valid for 10 minutes.</p>`
        );

        res.status(200).json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (new Date() > user.resetOtpExpiry) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        res.status(200).json({ success: true, message: "OTP verified" });

    } catch (error) {
        res.status(500).json({ success: false, message: "OTP verification failed" });
    }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (new Date() > user.resetOtpExpiry) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Password reset failed" });
    }
};