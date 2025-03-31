// commentSchema.ts
import mongoose from "mongoose";

interface IComment extends mongoose.Document {
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    post: mongoose.Schema.Types.ObjectId;
    parentComment?: mongoose.Schema.Types.ObjectId | null;
    repliesCount: number;
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
        repliesCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Add virtuals to include "id" in the JSON output
CommentSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        // If parentComment exists, convert it to a string.
        if (ret.parentComment) {
            ret.parentComment = ret.parentComment.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;

// import mongoose from "mongoose";

// interface IComment extends mongoose.Document {
//     content: string;
//     author: mongoose.Schema.Types.ObjectId;
//     post: mongoose.Schema.Types.ObjectId;
//     parentComment?: mongoose.Schema.Types.ObjectId;
//     repliesCount: number; // ✅ Add this
//     createdAt: Date;
// }

// const CommentSchema = new mongoose.Schema<IComment>(
//     {
//         content: { type: String, required: true },
//         author: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         post: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Post",
//             required: true,
//         },
//         parentComment: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Comment",
//             default: null,
//         },
//         repliesCount: { type: Number, default: 0 }, // ✅ Add this
//     },
//     { timestamps: true }
// );
// const Comment = mongoose.model<IComment>("Comment", CommentSchema);
// export default Comment;
