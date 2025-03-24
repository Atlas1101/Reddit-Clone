import User from "./userSchema";

export const getUserCommunitiesService = async (userId: string) => {
    const user = await User.findById(userId).populate(
        "subscribedCommunities",
        "name icon members"
    );

    if (!user) throw new Error("User not found");

    return user.subscribedCommunities.map((community: any) => ({
        _id: community._id,
        name: community.name,
        icon: community.icon || "",
        memberCount: community.members?.length || 0,
    }));
};
