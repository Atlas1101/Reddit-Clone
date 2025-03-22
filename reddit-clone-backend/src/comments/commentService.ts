import mongoose from "mongoose";
import Comment from "../comments/commentSchema";
import Post from "../posts/postSchema";
import User from "../users/userSchema";
import Vote from "../votes/voteSchema";
import { z } from "zod";
import {
    commentSchema,
    CommentInput,
    objectIdSchema,
} from "../middleware/validateAuth";

// 🔁 Recursive utility
const getAllChildComments = async (
    parentIds: mongoose.Types.ObjectId[],
    session: mongoose.ClientSession
): Promise<mongoose.Types.ObjectId[]> => {
    let allChildComments: mongoose.Types.ObjectId[] = [];
    const children = await Comment.find({ parentComment: { $in: parentIds } })
        .select("_id")
        .session(session);

    if (children.length > 0) {
        const childIds = children.map((c) => c._id as mongoose.Types.ObjectId);
        allChildComments = allChildComments.concat(
            childIds,
            await getAllChildComments(childIds, session)
        );
    }

    return allChildComments;
};

export const createCommentService = async (input: unknown, userId: string) => {
    const { postId, content, parentCommentId }: CommentInput =
        commentSchema.parse(input);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const post = await Post.findById(postId).session(session);
        if (!post) throw new Error("Post not found");

        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId).session(
                session
            );
            if (!parent) throw new Error("Parent comment not found");
        }

        const [comment] = await Comment.create(
            [
                {
                    post: postId,
                    parentComment: parentCommentId || null,
                    author: userId,
                    content,
                },
            ],
            { session }
        );

        if (parentCommentId) {
            await Comment.findByIdAndUpdate(
                parentCommentId,
                { $inc: { repliesCount: 1 } },
                { session }
            );
        } else {
            await Post.findByIdAndUpdate(
                postId,
                { $inc: { commentCount: 1 } },
                { session }
            );
        }

        await User.findByIdAndUpdate(
            userId,
            { $inc: { karma: 1 } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return comment;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const getCommentsByPostService = async (postIdRaw: string) => {
    const postId = objectIdSchema.parse(postIdRaw);
    return await Comment.find({ post: postId })
        .populate("author", "username")
        .sort({ createdAt: -1 });
};

export const updateCommentService = async (
    commentIdRaw: string,
    contentRaw: unknown,
    userId: string
) => {
    const commentId = objectIdSchema.parse(commentIdRaw);
    const { content } = commentSchema.pick({ content: true }).parse(contentRaw);

    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    if (comment.author.toString() !== userId) {
        throw new Error("Unauthorized");
    }

    const updated = await Comment.findOneAndUpdate(
        { _id: commentId, author: userId },
        { content },
        { new: true }
    );

    return updated;
};


export const deleteCommentService = async (
    commentIdRaw: string,
    userId: string
) => {
    const commentId = objectIdSchema.parse(commentIdRaw);
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const comment = await Comment.findById(commentId).session(session);
        if (!comment) throw new Error("Comment not found");

        if (comment.author.toString() !== userId) {
            throw new Error("Unauthorized");
        }

        const commentObjectId = new mongoose.Types.ObjectId(commentId);
        const allCommentsToDelete = [
            commentObjectId,
            ...(await getAllChildComments([commentObjectId], session)),
        ];

        const allVotes = await Vote.find({
            target: { $in: allCommentsToDelete },
            targetType: "comment",
        })
            .lean()
            .session(session);

        const totalKarmaLoss = allVotes.reduce(
            (sum, vote) => sum + vote.voteType,
            0
        );

        await User.findByIdAndUpdate(
            comment.author,
            { $inc: { karma: -totalKarmaLoss } },
            { session }
        );

        await Vote.deleteMany({
            target: { $in: allCommentsToDelete },
            targetType: "comment",
        }).session(session);

        await Comment.deleteMany({
            _id: { $in: allCommentsToDelete },
        }).session(session);

        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(
                comment.parentComment,
                { $inc: { repliesCount: -1 } },
                { session }
            );
        } else {
            await Post.findByIdAndUpdate(
                comment.post,
                { $inc: { commentCount: -1 } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
