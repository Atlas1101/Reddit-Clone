import mongoose from "mongoose";

interface IPost extends mongoose.Document {
    title: string;
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    community: string;
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
    },
    { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;
