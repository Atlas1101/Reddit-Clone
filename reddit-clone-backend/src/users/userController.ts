import { Request, Response } from "express";
import User from "../users/userSchema";
import { getUserCommunitiesService } from "./userService";

// AuthRequest interface if you use it
interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const getLoggedInUser = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await User.findById(req.user.id)
            .select("-password")
            .populate("subscribedCommunities"); // Populate the subscribedCommunities

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// shared handler logic
export const getUserCommunities = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;

        const resolvedUserId = userId === "me" ? req.user?.id : userId;

        if (!resolvedUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const communities = await getUserCommunitiesService(resolvedUserId);

        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
