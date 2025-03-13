import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema";

// ✅ Extend Request to include `user`
interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

// Define JWT Payload Type
interface DecodedUser {
    id: string;
    email: string;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res
            .status(401)
            .json({ message: "Unauthorized: No token provided" });
    }

    try {
        // ✅ Ensure TypeScript knows what `decoded` contains
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as DecodedUser;

        // ✅ Fetch user and assign to `req.user`
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Invalid token" });
        }

        req.user = { id: user._id.toString(), email: user.email };

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
