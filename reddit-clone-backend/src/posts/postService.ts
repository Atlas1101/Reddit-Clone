import mongoose from "mongoose";
import Post from "../posts/postSchema";
import Comment from "../comments/commentSchema";
import Vote from "../votes/voteSchema";
import User from "../users/userSchema";
import { postSchema, objectIdSchema } from "../middleware/validateAuth";
import { z } from "zod";

// Get all posts
export const getAllPostsService = async () => {
    return await Post.find().populate("author", "username");
};

// Get a post by ID
export const getPostByIdService = async (id: string) => {
    return await Post.findById(id).populate("author", "username");
};

// Create a new post
export const createPostService = async (body: unknown) => {
    const validatedData = postSchema.parse(body);
    const newPost = new Post(validatedData);
    await newPost.save();
    return newPost;
};

// Update an existing post
export const updatePostService = async (id: string, body: unknown) => {
    const validatedData = postSchema.partial().parse(body);

    const updatedPost = await Post.findByIdAndUpdate(id, validatedData, {
        new: true,
        runValidators: true,
    });

    return updatedPost;
};

// Delete a post (with all related comments and votes, and karma adjustment)
export const deletePostService = async (postIdRaw: string, userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const postId = objectIdSchema.parse(postIdRaw);

        const post = await Post.findById(postId).session(session);
        if (!post) throw new Error("Post not found");

        if (post.author.toString() !== userId) {
            throw new Error("Unauthorized");
        }

        const getAllNestedComments = async (
            parentIds: mongoose.Types.ObjectId[]
        ): Promise<mongoose.Types.ObjectId[]> => {
            let allComments: mongoose.Types.ObjectId[] = [];
            const children = await Comment.find({
                parentComment: { $in: parentIds },
            })
                .select("_id")
                .session(session);

            if (children.length > 0) {
                const childIds = children.map(
                    (c) => c._id as mongoose.Types.ObjectId
                );
                allComments = allComments.concat(
                    childIds,
                    await getAllNestedComments(childIds)
                );
            }

            return allComments;
        };

        const postObjectId = new mongoose.Types.ObjectId(postId);
        const allCommentsToDelete = await getAllNestedComments([postObjectId]);

        const allVotes = await Vote.find({
            target: { $in: [postId, ...allCommentsToDelete] },
            targetType: { $in: ["post", "comment"] },
        })
            .lean()
            .session(session);

        const totalKarmaLoss = allVotes.reduce(
            (sum, vote) => sum + vote.voteType,
            0
        );

        await User.findByIdAndUpdate(
            post.author,
            { $inc: { karma: -totalKarmaLoss } },
            { session }
        );

        await Vote.deleteMany({
            target: { $in: [postId, ...allCommentsToDelete] },
            targetType: { $in: ["post", "comment"] },
        }).session(session);

        await Comment.deleteMany({ _id: { $in: allCommentsToDelete } }).session(
            session
        );

        await Post.findByIdAndDelete(postId).session(session);

        await session.commitTransaction();
        session.endSession();

        return { message: "Post deleted successfully" };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
