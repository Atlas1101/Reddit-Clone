import { Community } from "./Community";
export interface User {
    _id: string;
    username: string;
    email: string;
    karma: number;
    subscribedCommunities?: Community[];
    createdAt: string;
    updatedAt: string;
    
}
