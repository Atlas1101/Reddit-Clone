import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema";
import { registerSchema, loginSchema } from "../middleware/validateAuth";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// **Register Route**
router.post("/register", async (req: Request, res: Request) => {
    try {
        // Validate user input using Zod
        const parsedData = registerSchema.parse(req.body);
        const { username, email, password } = parsedData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create and save user (password is auto-hashed in the model)
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: error.errors || "Invalid data" });
    }
});

// **Login Route**
router.post("/login", async (req: Request, res: Response) => {
    try {
        // Validate user input
        const parsedData = loginSchema.parse(req.body);
        const { email, password } = parsedData;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare passwords using your model's method
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

        // Store token in HTTP-only cookie
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(400).json({ error: error.errors || "Invalid data" });
    }
});

// **Logout Route**
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

export default router;
