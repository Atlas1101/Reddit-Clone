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
    voteType: 1 | -1 | 0;
}) => {
    const targetId = objectIdSchema.parse(targetIdRaw);

    const existing = await Vote.findOne({
        user: userId,
        entityId: targetId,
        entityType: targetType,
    });

    if (existing) {
        if (existing.voteType === voteType) {
            // Toggle off the vote (remove it)
            await Vote.deleteOne({ _id: existing._id });

            const score = await Vote.aggregate([
                { $match: { entityId: targetId } },
                { $group: { _id: null, total: { $sum: "$voteType" } } },
            ]);
            const finalScore = score[0]?.total || 0;

            return {
                message: "Vote removed",
                userVote: 0,
                score: finalScore,
            };
        }

        existing.voteType = voteType;
        await existing.save();

        const score = await Vote.aggregate([
            { $match: { entityId: targetId } },
            { $group: { _id: null, total: { $sum: "$voteType" } } },
        ]);
        const finalScore = score[0]?.total || 0;

        return {
            message: "Vote updated",
            userVote: voteType,
            score: finalScore,
        };
    }

    const newVote = new Vote({
        user: new mongoose.Types.ObjectId(userId),
        entityId: targetId,
        entityType: targetType,
        voteType,
    });

    await newVote.save();

    const score = await Vote.aggregate([
        { $match: { entityId: targetId } },
        { $group: { _id: null, total: { $sum: "$voteType" } } },
    ]);
    const finalScore = score[0]?.total || 0;

    return {
        message: "Vote cast",
        userVote: voteType,
        score: finalScore,
    };
};

export const getVoteScoreService = async ({
    entityId,
    entityType,
}: {
    entityId: string;
    entityType: "post" | "comment";
}) => {
    const score = await Vote.aggregate([
        {
            $match: {
                entityId: new mongoose.Types.ObjectId(entityId),
                entityType,
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$voteType" },
            },
        },
    ]);

    return score[0]?.total || 0;
};

///to be deleted
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
        entityId: targetId,
        entityType: targetType,
    });

    if (!result) throw new Error("Vote not found");

    return { message: "Vote removed" };
};
