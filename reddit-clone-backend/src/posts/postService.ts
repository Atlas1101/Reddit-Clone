import mongoose from "mongoose";
import Post from "../posts/postSchema";
import Comment from "../comments/commentSchema";
import Vote from "../votes/voteSchema";
import User from "../users/userSchema";
import {
    postSchema,
    objectIdSchema,
    createPostInputSchema,
} from "../middleware/validateAuth";
import { z } from "zod";

export const getAllPostsService = async () => {
    return await Post.find()
        .populate("author", "username")
        .populate("community", "name icon description bannerImage");
};

// Get a post by ID
export const getPostByIdService = async (id: string) => {
    return await Post.findById(id)
        .populate("author", "username")
        .populate("community", "name icon description bannerImage");
};

// Create a new post
export const createPostService = async (body: unknown, userId: string) => {
    if (typeof body !== "object" || body === null) {
        throw new Error("Invalid request body");
    }

    // Prevent user spoofing
    if ("author" in body && (body as any).author !== userId) {
        throw new Error(
            "Forbidden: Author ID does not match authenticated user."
        );
    }

    const { title, content, community, postType } =
        createPostInputSchema.parse(body); // ✅ now includes postType

    const post = new Post({
        title,
        content,
        community,
        postType, // ✅ new
        author: userId,
    });

    await post.save();
    return post;
};

// Update an existing post
export const updatePostService = async (
    id: string,
    body: unknown,
    userId: string
) => {
    const validatedData = postSchema
        .omit({ postType: true }) // ✅ exclude postType
        .partial()
        .parse(body);

    const post = await Post.findById(id);
    if (!post) throw new Error("Post not found");

    if (post.author.toString() !== userId) {
        throw new Error("Unauthorized: Cannot edit another user's post");
    }

    Object.assign(post, validatedData);
    await post.save();

    return post;
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

        // ✅ Recursive function to get nested child comment IDs
        const getAllNestedComments = async (
            parentIds: mongoose.Types.ObjectId[]
        ): Promise<mongoose.Types.ObjectId[]> => {
            let all: mongoose.Types.ObjectId[] = [];
            const children = await Comment.find({
                parentComment: { $in: parentIds },
            })
                .select("_id")
                .session(session);

            if (children.length > 0) {
                const childIds = children.map(
                    (c) => c._id as mongoose.Types.ObjectId
                );
                all = all.concat(
                    childIds,
                    await getAllNestedComments(childIds)
                );
            }

            return all;
        };

        // ✅ Step 1: Find top-level comments on the post
        const topLevelComments = await Comment.find({ post: postId }).session(
            session
        );
        const topLevelIds = topLevelComments.map(
            (c) => c._id as mongoose.Types.ObjectId
        );

        // ✅ Step 2: Recursively gather nested replies
        const nestedCommentIds = await getAllNestedComments(topLevelIds);

        const allCommentsToDelete = [...topLevelIds, ...nestedCommentIds];

        // ✅ Step 3: Get all related votes
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

        // ✅ Step 4: Apply karma penalty
        await User.findByIdAndUpdate(
            post.author,
            { $inc: { karma: -totalKarmaLoss } },
            { session }
        );

        // ✅ Step 5: Delete votes, comments, post
        if (allCommentsToDelete.length > 0) {
            await Vote.deleteMany({
                target: { $in: allCommentsToDelete },
                targetType: "comment",
            }).session(session);

            await Comment.deleteMany({
                _id: { $in: allCommentsToDelete },
            }).session(session);
        }

        await Vote.deleteMany({
            target: postId,
            targetType: "post",
        }).session(session);

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
