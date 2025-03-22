import Vote from "./voteSchema";
import { objectIdSchema } from "../middleware/validateAuth";
import mongoose from "mongoose";

export const castVoteService = async ({
    userId,
    targetIdRaw,
    targetType,
    voteType,
}: {
    userId: string;
    targetIdRaw: string;
    targetType: "post" | "comment";
    voteType: 1 | -1;
}) => {
    const targetId = objectIdSchema.parse(targetIdRaw);

    const existing = await Vote.findOne({
        user: userId,
        target: targetId,
        targetType,
    });

    if (existing) {
        if (existing.voteType === voteType) {
            throw new Error("Already voted");
        }

        existing.voteType = voteType;
        await existing.save();
        return { message: "Vote updated" };
    }

    const newVote = new Vote({
        user: new mongoose.Types.ObjectId(userId),
        target: targetId,
        targetType,
        voteType,
    });

    await newVote.save();
    return { message: "Vote cast" };
};

export const removeVoteService = async ({
    userId,
    targetIdRaw,
    targetType,
}: {
    userId: string;
    targetIdRaw: string;
    targetType: "post" | "comment";
}) => {
    const targetId = objectIdSchema.parse(targetIdRaw);

    const result = await Vote.findOneAndDelete({
        user: userId,
        target: targetId,
        targetType,
    });

    if (!result) throw new Error("Vote not found");

    return { message: "Vote removed" };
};
