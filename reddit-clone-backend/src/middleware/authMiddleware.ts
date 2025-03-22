import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../users/userSchema";

interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

interface DecodedUser {
    id: string;
    email: string;
}
export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let token;

    // First check for Bearer token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // If not in header, try from cookie
    if (!token && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as DecodedUser;

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
            return;
        }

        req.user = { id: user._id.toString(), email: user.email };
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
