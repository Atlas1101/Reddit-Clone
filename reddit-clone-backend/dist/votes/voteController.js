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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeVote = exports.castVote = void 0;
const zod_1 = require("zod");
const voteService_1 = require("./voteService");
const voteSchema = zod_1.z.object({
    targetId: zod_1.z.string().length(24),
    targetType: zod_1.z.enum(["post", "comment"]),
    voteType: zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(-1)]),
});
// @desc    Cast or update a vote
const castVote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { targetId, targetType, voteType } = voteSchema.parse(req.body);
        const result = yield (0, voteService_1.castVoteService)({
            userId: req.user.id,
            targetIdRaw: targetId,
            targetType,
            voteType,
        });
        res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({ message: error.message });
    }
});
exports.castVote = castVote;
// @desc    Remove a vote
const removeVote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { targetId, targetType } = voteSchema
            .omit({ voteType: true })
            .parse(req.body);
        const result = yield (0, voteService_1.removeVoteService)({
            userId: req.user.id,
            targetIdRaw: targetId,
            targetType,
        });
        res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({ message: error.message });
    }
});
exports.removeVote = removeVote;
