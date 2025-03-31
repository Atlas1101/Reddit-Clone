import { Request, Response } from "express";
import { z } from "zod";
import { castVoteService, removeVoteService } from "./voteService";
import { getVoteScoreService } from "./voteService";

interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

const voteSchema = z.object({
    targetId: z.string().length(24),
    targetType: z.enum(["post", "comment"]),
    voteType: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
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

        if (voteType === 0) {
            const result = await removeVoteService({
                userId: req.user.id,
                targetIdRaw: targetId,
                targetType,
            });
            res.status(200).json(result);
            return;
        }

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

export const getVoteScore = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { type, id } = req.query;

        if (!id || (type !== "post" && type !== "comment")) {
            res.status(400).json({ message: "Invalid query" });
            return;
        }

        const score = await getVoteScoreService({
            entityId: id as string,
            entityType: type as "post" | "comment",
        });

        res.status(200).json({ score });
    } catch (error) {
        res.status(500).json({ message: "Error fetching score" });
    }
};

// to be deleted
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
