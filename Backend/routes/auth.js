import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Helper — generate a signed JWT
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
};

// ─────────────────────────────────────────
// POST /api/auth/signup
// Body: { name, email, password }
// ─────────────────────────────────────────
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields." });
    }

    try {
        // Check if email already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        // Create user — password is hashed by the pre-save hook in User.js
        const user = await User.create({ name, email, password });

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id:    user._id,
                name:  user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.log("Signup error:", err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
// ─────────────────────────────────────────
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields." });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Compare password using model method
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                id:    user._id,
                name:  user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.log("Login error:", err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

// ─────────────────────────────────────────
// GET /api/auth/me  (optional — get current user)
// ─────────────────────────────────────────
import protect from "../middleware/authMiddleware.js";

router.get("/me", protect, async (req, res) => {
    res.json({
        id:    req.user._id,
        name:  req.user.name,
        email: req.user.email
    });
});

export default router;