export interface User {
    _id: string;
    username: string;
    email: string;
    karma: number;
    subscribedCommunities:[];
    createdAt: string;
    updatedAt: string;
}
