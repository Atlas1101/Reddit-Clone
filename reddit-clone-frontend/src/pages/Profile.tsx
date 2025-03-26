import { api } from "../services/api"
export default function Profile() {
    let user = {};
    api.get("/auth/me").then((response) => {
        console.log(response.data);
         user = response.data;
    });
    
    return (
    <>
        <div>👤 Profile Page – User info and posts.</div>
        
    </>
)}
