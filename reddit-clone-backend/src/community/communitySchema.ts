import mongoose from "mongoose";

interface CommunityRule {
    title: string;
    description: string;
    createdAt?: Date;
}

export interface ICommunity extends mongoose.Document {
    name: string;
    description: string;
    createdBy: mongoose.Types.ObjectId;
    moderators: mongoose.Types.ObjectId[];
    members: mongoose.Types.ObjectId[];
    rules: CommunityRule[];
    createdAt: Date;
    updatedAt: Date;
}

const CommunityRuleSchema = new mongoose.Schema<CommunityRule>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const CommunitySchema = new mongoose.Schema<ICommunity>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        members: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        rules: [CommunityRuleSchema], 
    },
    { timestamps: true }
);

const Community = mongoose.model<ICommunity>("Community", CommunitySchema);
export default Community;
