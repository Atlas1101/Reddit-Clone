import Community, { ICommunity } from "./communitySchema";
import mongoose from "mongoose";
import User from "../users/userSchema"; // Add this import

// Create community
export const createCommunityService = async (
    name: string,
    description: string,
    userId: string
): Promise<ICommunity> => {
    const community = new Community({
        name,
        description,
        createdBy: userId,
        moderators: [userId],
        members: [userId],
    });

    await community.save();
    
    // Update the user's subscribedCommunities array
    await User.findByIdAndUpdate(
        userId,
        { $addToSet: { subscribedCommunities: community._id } }
    );
    
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
    updateData: Partial<ICommunity>
): Promise<ICommunity | null> => {
    const community = await Community.findOne({
        _id: communityId,
        moderators: userId,
    });

    if (!community) {
        throw new Error("Community not found or unauthorized");
    }

    Object.assign(community, updateData);
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
