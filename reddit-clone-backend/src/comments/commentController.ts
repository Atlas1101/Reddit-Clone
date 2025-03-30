import { Request, Response } from "express";
import { z } from "zod";
import Comment from "../comments/commentSchema";
import {
    createCommentService,
    getCommentsByPostService,
    updateCommentService,
    deleteCommentService,
} from "../comments/commentService";

// ✅ Define Authenticated Request Type
interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

// 📌 CREATE COMMENT
export const createComment = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    console.log("➡️ Received request to create comment");

    try {
        if (!req.user) {
            console.warn("⛔ No user on request (unauthenticated)");
            res.status(401).json({
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const input = { ...req.body, author: req.user.id };
        console.log("📦 Input to service:", input);

        const comment = await createCommentService(input, req.user.id);

        console.log("✅ Comment created:", comment);
        res.status(201).json({
            message: "Comment created successfully",
            comment,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("❌ Zod validation error:", error.errors);
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }

        console.error("🔥 Unexpected error in createComment:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

// 📌 GET COMMENTS FOR A POST
export const getCommentsByPost = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

        const result = await getCommentsByPostService(
            req.params.postId,
            page,
            pageSize
        );

        res.status(200).json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }

        res.status(500).json({
            message: "Error fetching comments",
            error: (error as Error).message,
        });
    }
};

// 📌 UPDATE COMMENT
export const updateComment = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const updated = await updateCommentService(
            req.params.commentId,
            req.body,
            req.user.id
        );

        if (!updated) {
            res.status(404).json({
                message: "Comment not found or unauthorized",
            });
            return;
        }

        res.status(200).json({
            message: "Comment updated successfully",
            comment: updated,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }

        res.status(500).json({
            message: "Error updating comment",
            error: (error as Error).message,
        });
    }
};

// 📌 DELETE COMMENT
export const deleteComment = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        await deleteCommentService(req.params.commentId, req.user.id);

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }

        const message =
            error instanceof Error && error.message === "Unauthorized"
                ? "Unauthorized to delete this comment"
                : error instanceof Error
                ? error.message
                : "Error deleting comment";

        const status =
            message === "Unauthorized to delete this comment"
                ? 403
                : message === "Comment not found"
                ? 404
                : 500;

        res.status(status).json({
            message,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

// 📌 GET COMMENTS BY ID
export const getCommentsByUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { authorId } = req.query;

    try {
        const comments = await Comment.find({ author: authorId }).sort({
            createdAt: -1,
        });

        if (comments.length === 0) {
            res.status(404).json({
                message: "No comments found for this user",
            });
            return;
        }

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
// import { Request, Response } from "express";
// import { z } from "zod";
// import Comment from "../comments/commentSchema";
// import {
//     createCommentService,
//     getCommentsByPostService,
//     updateCommentService,
//     deleteCommentService,
// } from "../comments/commentService";

// // ✅ Define Authenticated Request Type
// interface AuthRequest extends Request {
//     user?: { id: string; email: string };
// }

// // 📌 CREATE COMMENT
// export const createComment = async (
//     req: AuthRequest,
//     res: Response
// ): Promise<void> => {
//     console.log("➡️ Received request to create comment");

//     try {
//         if (!req.user) {
//             console.warn("⛔ No user on request (unauthenticated)");
//             res.status(401).json({
//                 message: "Unauthorized: User not authenticated",
//             });
//             return;
//         }

//         const input = { ...req.body, author: req.user.id };
//         console.log("📦 Input to service:", input);

//         const comment = await createCommentService(input, req.user.id);

//         console.log("✅ Comment created:", comment);
//         res.status(201).json({
//             message: "Comment created successfully",
//             comment,
//         });
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             console.error("❌ Zod validation error:", error.errors);
//             res.status(400).json({
//                 message: "Validation error",
//                 errors: error.errors,
//             });
//             return;
//         }

//         console.error("🔥 Unexpected error in createComment:", error);
//         res.status(500).json({
//             message: "Internal server error",
//         });
//     }
// };

// // 📌 GET COMMENTS FOR A POST
// export const getCommentsByPost = async (
//     req: Request,
//     res: Response
// ): Promise<void> => {
//     try {
//         const comments = await getCommentsByPostService(req.params.postId);
//         res.status(200).json(comments);
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             res.status(400).json({
//                 message: "Validation error",
//                 errors: error.errors,
//             });
//             return;
//         }

//         res.status(500).json({
//             message: "Error fetching comments",
//             error: (error as Error).message,
//         });
//     }
// };

// // 📌 UPDATE COMMENT
// export const updateComment = async (
//     req: AuthRequest,
//     res: Response
// ): Promise<void> => {
//     try {
//         if (!req.user) {
//             res.status(401).json({
//                 message: "Unauthorized: User not authenticated",
//             });
//             return;
//         }

//         const updated = await updateCommentService(
//             req.params.commentId,
//             req.body,
//             req.user.id
//         );

//         if (!updated) {
//             res.status(404).json({
//                 message: "Comment not found or unauthorized",
//             });
//             return;
//         }

//         res.status(200).json({
//             message: "Comment updated successfully",
//             comment: updated,
//         });
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             res.status(400).json({
//                 message: "Validation error",
//                 errors: error.errors,
//             });
//             return;
//         }

//         res.status(500).json({
//             message: "Error updating comment",
//             error: (error as Error).message,
//         });
//     }
// };

// // 📌 DELETE COMMENT
// export const deleteComment = async (
//     req: AuthRequest,
//     res: Response
// ): Promise<void> => {
//     try {
//         if (!req.user) {
//             res.status(401).json({
//                 message: "Unauthorized: User not authenticated",
//             });
//             return;
//         }

//         await deleteCommentService(req.params.commentId, req.user.id);

//         res.status(200).json({ message: "Comment deleted successfully" });
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             res.status(400).json({
//                 message: "Validation error",
//                 errors: error.errors,
//             });
//             return;
//         }

//         const message =
//             error instanceof Error && error.message === "Unauthorized"
//                 ? "Unauthorized to delete this comment"
//                 : error instanceof Error
//                 ? error.message
//                 : "Error deleting comment";

//         const status =
//             message === "Unauthorized to delete this comment"
//                 ? 403
//                 : message === "Comment not found"
//                 ? 404
//                 : 500;

//         res.status(status).json({
//             message,
//             error: error instanceof Error ? error.message : "Unknown error",
//         });
//     }
// };

// // 📌 GET COMMENTS BY ID
// export const getCommentsByUser = async (req: Request, res: Response): Promise<void> => {
//     const { authorId } = req.query;

//     try {
//         const comments = await Comment.find({ author: authorId })
//                                       .sort({ createdAt: -1 });

//         if (comments.length === 0) {
//             res.status(404).json({ message: "No comments found for this user" });
//             return;
//         }

//         res.status(200).json(comments);
//     } catch (error) {
//         res.status(500).json({ message: (error as Error).message });
//     }
// };

// // import { Request, Response } from "express";
// // import mongoose from "mongoose";
// // import Comment from "../comments/commentSchema";
// // import Post from "../posts/postSchema";
// // import User from "../users/userSchema";
// // import Vote from "../votes/voteSchema";
// // import { z } from "zod";
// // import {
// //     commentSchema,
// //     CommentInput,
// //     objectIdSchema,
// // } from "../middleware/validateAuth";

// // // ✅ Define Authenticated Request Type
// // interface AuthRequest extends Request {
// //     user?: { id: string; email: string };
// // }

// // // 📌 CREATE COMMENT
// // export const createComment = async (req: AuthRequest, res: Response) => {
// //     try {
// //         // Validate request body
// //         const { postId, content, parentCommentId }: CommentInput =
// //             commentSchema.parse(req.body);

// //         // ✅ Ensure user is authenticated
// //         if (!req.user) {
// //             return res
// //                 .status(401)
// //                 .json({ message: "Unauthorized: User not authenticated" });
// //         }
// //         const userId = req.user.id;

// //         // Start a transaction
// //         const session = await mongoose.startSession();
// //         session.startTransaction();

// //         try {
// //             // Ensure post exists
// //             const post = await Post.findById(postId).session(session);
// //             if (!post) throw new Error("Post not found");

// //             // If replying, ensure parent comment exists
// //             if (parentCommentId) {
// //                 const parentComment = await Comment.findById(
// //                     parentCommentId
// //                 ).session(session);
// //                 if (!parentComment) throw new Error("Parent comment not found");
// //             }

// //             // Create the new comment
// //             const [comment] = await Comment.create(
// //                 [
// //                     {
// //                         post: postId,
// //                         parentComment: parentCommentId || null,
// //                         author: userId,
// //                         content,
// //                     },
// //                 ],
// //                 { session }
// //             );

// //             // If top-level comment, increment post's comment count
// //             if (!parentCommentId) {
// //                 await Post.findByIdAndUpdate(
// //                     postId,
// //                     { $inc: { commentCount: 1 } },
// //                     { session }
// //                 );
// //             } else {
// //                 // If reply, increment parent comment's replies count
// //                 await Comment.findByIdAndUpdate(
// //                     parentCommentId,
// //                     { $inc: { repliesCount: 1 } },
// //                     { session }
// //                 );
// //             }

// //             // Increment user karma (optional feature)
// //             await User.findByIdAndUpdate(
// //                 userId,
// //                 { $inc: { karma: 1 } },
// //                 { session }
// //             );

// //             // Commit transaction
// //             await session.commitTransaction();
// //             session.endSession();

// //             return res
// //                 .status(201)
// //                 .json({ message: "Comment created successfully", comment });
// //         } catch (error) {
// //             await session.abortTransaction();
// //             session.endSession();
// //             return res.status(400).json({ message: (error as Error).message });
// //         } finally {
// //             session.endSession();
// //         }
// //     } catch (error) {
// //         if (error instanceof z.ZodError) {
// //             return res
// //                 .status(400)
// //                 .json({ message: "Validation error", errors: error.errors });
// //         }
// //         console.error("Server error:", error);
// //         return res.status(500).json({ message: "Error creating comment" });
// //     }
// // };

// // // 📌 GET COMMENTS FOR A POST
// // export const getCommentsByPost = async (req: Request, res: Response) => {
// //     try {
// //         // ✅ Validate `postId` from URL params using imported `objectIdSchema`
// //         const postId = objectIdSchema.parse(req.params.postId);

// //         // ✅ Fetch comments and populate author details
// //         const comments = await Comment.find({ post: postId })
// //             .populate("author", "username") // Only return username
// //             .sort({ createdAt: -1 });

// //         return res.status(200).json(comments);
// //     } catch (error) {
// //         if (error instanceof z.ZodError) {
// //             return res
// //                 .status(400)
// //                 .json({ message: "Validation error", errors: error.errors });
// //         }
// //         return res.status(500).json({
// //             message: "Error fetching comments",
// //             error: (error as Error).message,
// //         });
// //     }
// // };

// // // 📌 UPDATE COMMENT
// // export const updateComment = async (req: AuthRequest, res: Response) => {
// //     try {
// //         // ✅ Validate `commentId` from params
// //         const commentId = objectIdSchema.parse(req.params.commentId);

// //         // ✅ Ensure user is authenticated
// //         if (!req.user) {
// //             return res
// //                 .status(401)
// //                 .json({ message: "Unauthorized: User not authenticated" });
// //         }
// //         const userId = req.user.id;

// //         // ✅ Validate `content` from request body
// //         const { content } = commentSchema
// //             .pick({ content: true })
// //             .parse(req.body);

// //         // ✅ Ensure user owns the comment before updating
// //         const comment = await Comment.findOneAndUpdate(
// //             { _id: commentId, author: userId }, // Ensure only the author can update
// //             { content },
// //             { new: true }
// //         );

// //         if (!comment) {
// //             return res
// //                 .status(404)
// //                 .json({ message: "Comment not found or unauthorized" });
// //         }

// //         return res
// //             .status(200)
// //             .json({ message: "Comment updated successfully", comment });
// //     } catch (error) {
// //         if (error instanceof z.ZodError) {
// //             return res
// //                 .status(400)
// //                 .json({ message: "Validation error", errors: error.errors });
// //         }
// //         return res.status(500).json({
// //             message: "Error updating comment",
// //             error: (error as Error).message,
// //         });
// //     }
// // };

// // // 📌 DELETE COMMENT (Recursively delete child comments & update karma)
// // export const deleteComment = async (req: AuthRequest, res: Response) => {
// //     const session = await mongoose.startSession();
// //     session.startTransaction();

// //     try {
// //         // ✅ Validate `commentId` from params
// //         const commentId = objectIdSchema.parse(req.params.commentId);

// //         // ✅ Ensure user is authenticated
// //         if (!req.user) {
// //             return res
// //                 .status(401)
// //                 .json({ message: "Unauthorized: User not authenticated" });
// //         }
// //         const userId = req.user.id;

// //         // ✅ Convert `commentId` to `ObjectId`
// //         const commentObjectId = new mongoose.Types.ObjectId(commentId);

// //         // ✅ Find the comment
// //         const comment = await Comment.findById(commentObjectId).session(
// //             session
// //         );
// //         if (!comment) {
// //             return res.status(404).json({ message: "Comment not found" });
// //         }

// //         // ✅ Ensure the user is the owner
// //         if (comment.author.toString() !== userId) {
// //             return res
// //                 .status(403)
// //                 .json({ message: "Unauthorized to delete this comment" });
// //         }

// //         // ✅ Recursive function to find all child comments
// //         const getAllChildComments = async (
// //             parentIds: mongoose.Types.ObjectId[]
// //         ): Promise<mongoose.Types.ObjectId[]> => {
// //             let allChildComments: mongoose.Types.ObjectId[] = [];
// //             const children = await Comment.find({
// //                 parentComment: { $in: parentIds },
// //             })
// //                 .select("_id")
// //                 .session(session);

// //             if (children.length > 0) {
// //                 const childIds: mongoose.Types.ObjectId[] = children.map(
// //                     (c) => c._id as mongoose.Types.ObjectId
// //                 );
// //                 allChildComments = allChildComments.concat(
// //                     childIds,
// //                     await getAllChildComments(childIds)
// //                 );
// //             }

// //             return allChildComments;
// //         };

// //         // ✅ Get all comments to delete (parent + all children)
// //         const allCommentsToDelete = [
// //             commentObjectId,
// //             ...(await getAllChildComments([commentObjectId])),
// //         ];

// //         // ✅ Get all votes related to the comment and its children
// //         const allVotes = await Vote.find({
// //             target: { $in: allCommentsToDelete },
// //             targetType: "comment",
// //         })
// //             .lean() // ✅ Fixes `.value` access issue
// //             .session(session);

// //         // ✅ Sum up vote scores for karma deduction
// //         const totalKarmaLoss = allVotes.reduce(
// //             (sum, vote) => sum + vote.voteType,
// //             0
// //         );

// //         // ✅ Deduct karma from the user
// //         await User.findByIdAndUpdate(
// //             comment.author,
// //             { $inc: { karma: -totalKarmaLoss } },
// //             { session }
// //         );

// //         // ✅ Delete all votes related to the comment and its children
// //         await Vote.deleteMany({
// //             target: { $in: allCommentsToDelete },
// //             targetType: "comment",
// //         }).session(session);

// //         // ✅ Delete all child comments recursively
// //         await Comment.deleteMany({
// //             _id: { $in: allCommentsToDelete },
// //         }).session(session);

// //         // ✅ Update parent comment's `repliesCount` OR post's `commentCount`
// //         if (comment.parentComment) {
// //             await Comment.findByIdAndUpdate(
// //                 comment.parentComment,
// //                 { $inc: { repliesCount: -1 } },
// //                 { session }
// //             );
// //         } else {
// //             await Post.findByIdAndUpdate(
// //                 comment.post,
// //                 { $inc: { commentCount: -1 } },
// //                 { session }
// //             );
// //         }

// //         // ✅ Commit transaction
// //         await session.commitTransaction();
// //         session.endSession();

// //         return res
// //             .status(200)
// //             .json({ message: "Comment deleted successfully" });
// //     } catch (error) {
// //         await session.abortTransaction();
// //         session.endSession();

// //         if (error instanceof z.ZodError) {
// //             return res
// //                 .status(400)
// //                 .json({ message: "Validation error", errors: error.errors });
// //         }

// //         return res.status(500).json({
// //             message: "Error deleting comment",
// //             error: (error as Error).message,
// //         });
// //     }
// // };
