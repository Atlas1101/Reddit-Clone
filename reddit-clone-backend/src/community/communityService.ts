import Community, { ICommunity } from "./communitySchema";
import mongoose from "mongoose";
import User from "../users/userSchema";
import { createCommunitySchema } from "../middleware/validateAuth"; // adjust path if needed

interface CreateCommunityInput {
    name: string;
    description?: string;
    icon?: string;
    rules?: {
        title: string;
        description: string;
    }[];
}

// Create community
export const createCommunityService = async (
    body: unknown,
    userId: string
): Promise<ICommunity> => {
    // Zod validation inline
    const { name, description, icon, rules } =
        createCommunitySchema.parse(body);

    const community = new Community({
        name,
        description,
        icon,
        rules: rules || [],
        createdBy: userId,
        moderators: [userId],
        members: [userId],
    });

    await community.save();

    // Add this community to the user's subscriptions
    await User.findByIdAndUpdate(userId, {
        $addToSet: { subscribedCommunities: community._id },
    });

    return community;
};

// Get community by ID
export const getCommunityByIdService = async (
    communityId: string
): Promise<ICommunity | null> => {
    return await Community.findById(communityId)
        .populate("createdBy", "username")
        .populate("moderators", "username")
        .populate("members", "username");
};

export const getAllCommunitiesService = async () => {
    return Community.find().select("name members icon");
};

// Update community
export const updateCommunityService = async (
    communityId: string,
    userId: string,
    body: unknown
): Promise<ICommunity | null> => {
    // Zod inline validation — all fields optional
    const validatedData = createCommunitySchema.partial().parse(body);

    const community = await Community.findOne({
        _id: communityId,
        moderators: userId,
    });

    if (!community) {
        throw new Error("Community not found or unauthorized");
    }

    Object.assign(community, validatedData);
    await community.save();

    return community;
};

// Delete community
export const deleteCommunityService = async (
    communityId: string,
    userId: string
): Promise<void> => {
    const community = await Community.findOneAndDelete({
        _id: communityId,
        createdBy: userId,
    });

    if (!community) {
        throw new Error("Community not found or unauthorized");
    }
};

// Join community
export const joinCommunityService = async (
    communityId: string,
    userId: string
): Promise<ICommunity | null> => {
    return await Community.findByIdAndUpdate(
        communityId,
        { $addToSet: { members: userId } },
        { new: true }
    );
};

// Leave community
export const leaveCommunityService = async (
    communityId: string,
    userId: string
): Promise<ICommunity | null> => {
    return await Community.findByIdAndUpdate(
        communityId,
        { $pull: { members: userId, moderators: userId } },
        { new: true }
    );
};

// Add community rule
export const addCommunityRuleService = async (
    communityId: string,
    userId: string,
    rule: { title: string; description: string }
): Promise<ICommunity | null> => {
    const community = await Community.findOne({
        _id: communityId,
        moderators: userId,
    });

    if (!community) {
        throw new Error("Community not found or unauthorized");
    }

    community.rules.push(rule);
    await community.save();

    return community;
};
