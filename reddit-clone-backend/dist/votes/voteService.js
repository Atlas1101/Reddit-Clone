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
exports.removeVoteService = exports.castVoteService = void 0;
const voteSchema_1 = __importDefault(require("./voteSchema"));
const validateAuth_1 = require("../middleware/validateAuth");
const mongoose_1 = __importDefault(require("mongoose"));
const castVoteService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, targetIdRaw, targetType, voteType, }) {
    const targetId = validateAuth_1.objectIdSchema.parse(targetIdRaw);
    const existing = yield voteSchema_1.default.findOne({
        user: userId,
        target: targetId,
        targetType,
    });
    if (existing) {
        if (existing.voteType === voteType) {
            throw new Error("Already voted");
        }
        existing.voteType = voteType;
        yield existing.save();
        return { message: "Vote updated" };
    }
    const newVote = new voteSchema_1.default({
        user: new mongoose_1.default.Types.ObjectId(userId),
        target: targetId,
        targetType,
        voteType,
    });
    yield newVote.save();
    return { message: "Vote cast" };
});
exports.castVoteService = castVoteService;
const removeVoteService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, targetIdRaw, targetType, }) {
    const targetId = validateAuth_1.objectIdSchema.parse(targetIdRaw);
    const result = yield voteSchema_1.default.findOneAndDelete({
        user: userId,
        target: targetId,
        targetType,
    });
    if (!result)
        throw new Error("Vote not found");
    return { message: "Vote removed" };
});
exports.removeVoteService = removeVoteService;
