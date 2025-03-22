import { Request, Response } from "express";
import { z } from "zod";
import { castVoteService, removeVoteService } from "./voteService";

interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

const voteSchema = z.object({
    targetId: z.string().length(24),
    targetType: z.enum(["post", "comment"]),
    voteType: z.union([z.literal(1), z.literal(-1)]),
});

// @desc    Cast or update a vote
export const castVote = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { targetId, targetType, voteType } = voteSchema.parse(req.body);
        const result = await castVoteService({
            userId: req.user.id,
            targetIdRaw: targetId,
            targetType,
            voteType,
        });

        res.status(200).json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({ message: (error as Error).message });
    }
};

// @desc    Remove a vote
export const removeVote = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { targetId, targetType } = voteSchema
            .omit({ voteType: true })
            .parse(req.body);

        const result = await removeVoteService({
            userId: req.user.id,
            targetIdRaw: targetId,
            targetType,
        });

        res.status(200).json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({ message: (error as Error).message });
    }
};
