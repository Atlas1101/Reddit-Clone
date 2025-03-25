import { Request, Response } from "express";
import {
    userLoginSchema,
    userRegisterSchema,
} from "../middleware/validateAuth";
import { loginUserService, registerUserService } from "./authService";

// ✅ Register
export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const parsedData = userRegisterSchema.parse(req.body);
        const newUser = await registerUserService(parsedData);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({
            error: (error as Error).message || "Invalid data",
        });
    }
};

// ✅ Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedData = userLoginSchema.parse(req.body);
        const { token } = await loginUserService(parsedData);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", // ← add this ill change to none when adding front end and running it on 3000 !!!!!!!!!!!!!!!
        });
        
        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(400).json({
            error: (error as Error).message || "Invalid data",
        });
    }
};

// ✅ Logout
export const logoutUser = (req: Request, res: Response): void => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};


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
