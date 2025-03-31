import mongoose from "mongoose";

type PostType = "text" | "image" | "link" | "poll";

interface IPost extends mongoose.Document {
    title: string;
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    community:
        | mongoose.Types.ObjectId
        | {
              _id: mongoose.Types.ObjectId; // ✅ Add this line
              name: string;
              icon?: string;
              description?: string;
              bannerImage?: string;
          };

    postType: PostType;
    commentCount: number;
    createdAt: Date;
    _id: mongoose.Types.ObjectId;
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
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
            required: true,
        },
        postType: {
            type: String,
            enum: ["text", "image", "link", "poll"],
            required: true,
        },
        commentCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;
