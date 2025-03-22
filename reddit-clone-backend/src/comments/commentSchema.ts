import mongoose from "mongoose";

interface IComment extends mongoose.Document {
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    post: mongoose.Schema.Types.ObjectId;
    parentComment?: mongoose.Schema.Types.ObjectId;
    repliesCount: number; // ✅ Add this
    createdAt: Date;
}

const CommentSchema = new mongoose.Schema<IComment>(
    {
        content: { type: String, required: true },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        repliesCount: { type: Number, default: 0 }, // ✅ Add this
    },
    { timestamps: true }
);
const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
