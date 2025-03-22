"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VoteSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    entityType: { type: String, enum: ["post", "comment"], required: true },
    entityId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    voteType: { type: Number, enum: [1, -1], required: true },
}, { timestamps: true });
const Vote = mongoose_1.default.model("Vote", VoteSchema);
exports.default = Vote;
