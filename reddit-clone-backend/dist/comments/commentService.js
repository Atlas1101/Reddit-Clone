"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentService = exports.updateCommentService = exports.getCommentsByPostService = exports.createCommentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema_1 = __importDefault(require("../comments/commentSchema"));
const postSchema_1 = __importDefault(require("../posts/postSchema"));
const userSchema_1 = __importDefault(require("../users/userSchema"));
const voteSchema_1 = __importDefault(require("../votes/voteSchema"));
const validateAuth_1 = require("../middleware/validateAuth");
// 🔁 Recursive utility
const getAllChildComments = (parentIds, session) => __awaiter(void 0, void 0, void 0, function* () {
    let allChildComments = [];
    const children = yield commentSchema_1.default.find({ parentComment: { $in: parentIds } })
        .select("_id")
        .session(session);
    if (children.length > 0) {
        const childIds = children.map((c) => c._id);
        allChildComments = allChildComments.concat(childIds, yield getAllChildComments(childIds, session));
    }
    return allChildComments;
});
const createCommentService = (input, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, content, parentCommentId } = validateAuth_1.commentSchema.parse(input);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const post = yield postSchema_1.default.findById(postId).session(session);
        if (!post)
            throw new Error("Post not found");
        if (parentCommentId) {
            const parent = yield commentSchema_1.default.findById(parentCommentId).session(session);
            if (!parent)
                throw new Error("Parent comment not found");
        }
        const [comment] = yield commentSchema_1.default.create([
            {
                post: postId,
                parentComment: parentCommentId || null,
                author: userId,
                content,
            },
        ], { session });
        if (parentCommentId) {
            yield commentSchema_1.default.findByIdAndUpdate(parentCommentId, { $inc: { repliesCount: 1 } }, { session });
        }
        else {
            yield postSchema_1.default.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } }, { session });
        }
        yield userSchema_1.default.findByIdAndUpdate(userId, { $inc: { karma: 1 } }, { session });
        yield session.commitTransaction();
        session.endSession();
        return comment;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.createCommentService = createCommentService;
const getCommentsByPostService = (postIdRaw) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = validateAuth_1.objectIdSchema.parse(postIdRaw);
    return yield commentSchema_1.default.find({ post: postId })
        .populate("author", "username")
        .sort({ createdAt: -1 });
});
exports.getCommentsByPostService = getCommentsByPostService;
const updateCommentService = (commentIdRaw, contentRaw, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = validateAuth_1.objectIdSchema.parse(commentIdRaw);
    const { content } = validateAuth_1.commentSchema.pick({ content: true }).parse(contentRaw);
    const updated = yield commentSchema_1.default.findOneAndUpdate({ _id: commentId, author: userId }, { content }, { new: true });
    return updated;
});
exports.updateCommentService = updateCommentService;
const deleteCommentService = (commentIdRaw, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = validateAuth_1.objectIdSchema.parse(commentIdRaw);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const comment = yield commentSchema_1.default.findById(commentId).session(session);
        if (!comment)
            throw new Error("Comment not found");
        if (comment.author.toString() !== userId) {
            throw new Error("Unauthorized");
        }
        const commentObjectId = new mongoose_1.default.Types.ObjectId(commentId);
        const allCommentsToDelete = [
            commentObjectId,
            ...(yield getAllChildComments([commentObjectId], session)),
        ];
        const allVotes = yield voteSchema_1.default.find({
            target: { $in: allCommentsToDelete },
            targetType: "comment",
        })
            .lean()
            .session(session);
        const totalKarmaLoss = allVotes.reduce((sum, vote) => sum + vote.voteType, 0);
        yield userSchema_1.default.findByIdAndUpdate(comment.author, { $inc: { karma: -totalKarmaLoss } }, { session });
        yield voteSchema_1.default.deleteMany({
            target: { $in: allCommentsToDelete },
            targetType: "comment",
        }).session(session);
        yield commentSchema_1.default.deleteMany({
            _id: { $in: allCommentsToDelete },
        }).session(session);
        // ✅ Safe branching for count update
        if (comment.parentComment) {
            yield commentSchema_1.default.findByIdAndUpdate(comment.parentComment, { $inc: { repliesCount: -1 } }, { session });
        }
        else {
            yield postSchema_1.default.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } }, { session });
        }
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.deleteCommentService = deleteCommentService;
