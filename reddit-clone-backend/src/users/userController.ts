import { Request, Response } from "express";
import User from "../users/userSchema";

// AuthRequest interface if you use it
interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const getLoggedInUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};