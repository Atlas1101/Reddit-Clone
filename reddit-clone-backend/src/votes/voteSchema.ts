import mongoose from "mongoose";

interface IVote extends mongoose.Document {
    user: mongoose.Schema.Types.ObjectId;
    entityType: "post" | "comment";
    entityId: mongoose.Schema.Types.ObjectId;
    voteType: number;
    createdAt: Date;
}

const VoteSchema = new mongoose.Schema<IVote>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        entityType: { type: String, enum: ["post", "comment"], required: true },
        entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
        voteType: { type: Number, enum: [1, 0, -1], required: true },
    },
    { timestamps: true }
);

const Vote = mongoose.model<IVote>("Vote", VoteSchema);
export default Vote;
