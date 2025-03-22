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
exports.deletePostService = exports.updatePostService = exports.createPostService = exports.getPostByIdService = exports.getAllPostsService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema_1 = __importDefault(require("../posts/postSchema"));
const commentSchema_1 = __importDefault(require("../comments/commentSchema"));
const voteSchema_1 = __importDefault(require("../votes/voteSchema"));
const userSchema_1 = __importDefault(require("../users/userSchema"));
const validateAuth_1 = require("../middleware/validateAuth");
// Get all posts
const getAllPostsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield postSchema_1.default.find().populate("author", "username");
});
exports.getAllPostsService = getAllPostsService;
// Get a post by ID
const getPostByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postSchema_1.default.findById(id).populate("author", "username");
});
exports.getPostByIdService = getPostByIdService;
// Create a new post
const createPostService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = validateAuth_1.postSchema.parse(body);
    const newPost = new postSchema_1.default(validatedData);
    yield newPost.save();
    return newPost;
});
exports.createPostService = createPostService;
// Update an existing post
const updatePostService = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = validateAuth_1.postSchema.partial().parse(body);
    const updatedPost = yield postSchema_1.default.findByIdAndUpdate(id, validatedData, {
        new: true,
        runValidators: true,
    });
    return updatedPost;
});
exports.updatePostService = updatePostService;
// Delete a post (with all related comments and votes, and karma adjustment)
const deletePostService = (postIdRaw, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const postId = validateAuth_1.objectIdSchema.parse(postIdRaw);
        const post = yield postSchema_1.default.findById(postId).session(session);
        if (!post)
            throw new Error("Post not found");
        if (post.author.toString() !== userId) {
            throw new Error("Unauthorized");
        }
        const getAllNestedComments = (parentIds) => __awaiter(void 0, void 0, void 0, function* () {
            let allComments = [];
            const children = yield commentSchema_1.default.find({
                parentComment: { $in: parentIds },
            })
                .select("_id")
                .session(session);
            if (children.length > 0) {
                const childIds = children.map((c) => c._id);
                allComments = allComments.concat(childIds, yield getAllNestedComments(childIds));
            }
            return allComments;
        });
        const postObjectId = new mongoose_1.default.Types.ObjectId(postId);
        const allCommentsToDelete = yield getAllNestedComments([postObjectId]);
        const allVotes = yield voteSchema_1.default.find({
            target: { $in: [postId, ...allCommentsToDelete] },
            targetType: { $in: ["post", "comment"] },
        })
            .lean()
            .session(session);
        const totalKarmaLoss = allVotes.reduce((sum, vote) => sum + vote.voteType, 0);
        yield userSchema_1.default.findByIdAndUpdate(post.author, { $inc: { karma: -totalKarmaLoss } }, { session });
        yield voteSchema_1.default.deleteMany({
            target: { $in: [postId, ...allCommentsToDelete] },
            targetType: { $in: ["post", "comment"] },
        }).session(session);
        yield commentSchema_1.default.deleteMany({ _id: { $in: allCommentsToDelete } }).session(session);
        yield postSchema_1.default.findByIdAndDelete(postId).session(session);
        yield session.commitTransaction();
        session.endSession();
        return { message: "Post deleted successfully" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.deletePostService = deletePostService;
