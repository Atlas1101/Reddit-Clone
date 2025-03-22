"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const validateAuth_1 = require("../middleware/validateAuth");
const authService_1 = require("./authService");
// ✅ Register
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = validateAuth_1.userRegisterSchema.parse(req.body);
        const newUser = yield (0, authService_1.registerUserService)(parsedData);
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(400).json({
            error: error.message || "Invalid data",
        });
    }
});
exports.registerUser = registerUser;
// ✅ Login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = validateAuth_1.userLoginSchema.parse(req.body);
        const { token } = yield (0, authService_1.loginUserService)(parsedData);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        res.json({ message: "Login successful" });
    }
    catch (error) {
        res.status(400).json({
            error: error.message || "Invalid data",
        });
    }
});
exports.loginUser = loginUser;
// ✅ Logout
const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};
exports.logoutUser = logoutUser;
// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import User from "../users/userSchema";
// import {
//     userLoginSchema,
//     userRegisterSchema,
// } from "../middleware/validateAuth";
// const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
// // **Register Controller**
// export const registerUser = async (
//     req: Request,
//     res: Response
// ): Promise<void> => {
//     try {
//         const parsedData = userRegisterSchema.parse(req.body);
//         const { username, email, password } = parsedData;
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             res.status(400).json({ error: "Email already registered" });
//             return;
//         }
//         const newUser = new User({ username, email, password });
//         await newUser.save();
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         res.status(400).json({ error: error || "Invalid data" });
//     }
// };
// // **Login Controller**
// export const loginUser = async (req: Request, res: Response): Promise<void> => {
//     try {
//         // makes the calls
//         const parsedData = userLoginSchema.parse(req.body);
//         const { email, password } = parsedData;
//         const user = await User.findOne({ email }); // communicates with the database
//         if (!user) {
//             res.status(400).json({ error: "Invalid credentials" });
//             return;
//         }
//         const isPasswordValid = await user.comparePassword(password);
//         if (!isPasswordValid) {
//             res.status(400).json({ error: "Invalid credentials" });
//             return;
//         }
//         const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
//             expiresIn: "7d",
//         });
//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//         });
//         res.json({ message: "Login successful" });
//     } catch (error) {
//         res.status(400).json({ error: error || "Invalid data" });
//     }
// };
// // **Logout Controller**
// export const logoutUser = (req: Request, res: Response): void => {
//     res.clearCookie("token");
//     res.json({ message: "Logged out successfully" });
// };
