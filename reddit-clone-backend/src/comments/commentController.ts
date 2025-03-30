import { Request, Response } from "express";
import { z } from "zod";
import Comment from "../comments/commentSchema";
import {
    createCommentService,
    getCommentsByPostService,
    updateCommentService,
    deleteCommentService,
} from "../comments/commentService";

// Define Authenticated Request Type
interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

// CREATE COMMENT
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

// GET COMMENTS FOR A POST
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

// UPDATE COMMENT
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

// DELETE COMMENT
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

// GET COMMENTS BY USER
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
//         const page = parseInt(req.query.page as string, 10) || 1;
//         const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

//         const result = await getCommentsByPostService(
//             req.params.postId,
//             page,
//             pageSize
//         );

//         res.status(200).json(result);
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
// export const getCommentsByUser = async (
//     req: Request,
//     res: Response
// ): Promise<void> => {
//     const { authorId } = req.query;

//     try {
//         const comments = await Comment.find({ author: authorId }).sort({
//             createdAt: -1,
//         });

//         if (comments.length === 0) {
//             res.status(404).json({
//                 message: "No comments found for this user",
//             });
//             return;
//         }

//         res.status(200).json(comments);
//     } catch (error) {
//         res.status(500).json({ message: (error as Error).message });
//     }
// };
