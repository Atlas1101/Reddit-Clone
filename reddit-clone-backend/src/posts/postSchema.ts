import mongoose from "mongoose";

type PostType = "text" | "image" | "link" | "poll";

interface IPost extends mongoose.Document {
    title: string;
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    community: string;
    postType: PostType; // ✅ NEW
    commentCount: number;
    createdAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        community: { type: String, required: true },
        postType: {
            type: String,
            enum: ["text", "image", "link", "poll"], // ✅ NEW
            required: true,
        },
        commentCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;
