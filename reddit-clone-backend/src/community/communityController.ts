import { Request, Response } from "express";
import {
    createCommunityService,
    getCommunityByIdService,
    updateCommunityService,
    deleteCommunityService,
    joinCommunityService,
    leaveCommunityService,
    addCommunityRuleService
} from "../community/communityService";

// Authenticated request type
interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

// Create Community
export const createCommunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { name, description } = req.body;
        const community = await createCommunityService(name, description, req.user.id);
        res.status(201).json({ message: "Community created", community });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get Community by ID
export const getCommunityById = async (req: Request, res: Response): Promise<void> => {
    try {
        const community = await getCommunityByIdService(req.params.id);
        if (!community) {
            res.status(404).json({ message: "Community not found" });
            return;
        }
        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Join Community
export const joinCommunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const community = await joinCommunityService(req.params.id, req.user.id);
        res.status(200).json({ message: "Joined community", community });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Leave Community
export const leaveCommunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const community = await leaveCommunityService(req.params.id, req.user.id);
        res.status(200).json({ message: "Left community", community });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Add Community Rule
export const addCommunityRule = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { title, description } = req.body;
        const community = await addCommunityRuleService(req.params.id, req.user.id, { title, description });
        res.status(200).json({ message: "Rule added", community });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateCommunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { name, description } = req.body;
        const community = await updateCommunityService(req.params.id, req.user.id, { name, description });

        if (!community) {
            res.status(404).json({ message: "Community not found" });
            return;
        }

        res.status(200).json({ message: "Community updated", community });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteCommunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        await deleteCommunityService(req.params.id, req.user.id);
        res.status(200).json({ message: "Community deleted" });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};