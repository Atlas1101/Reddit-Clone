import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
});

export const auth = {
    login: async (email: string, password: string) => {
        try {
            const response = await api.post(
                "/auth/login",
                { email, password },
                {
                    withCredentials: true,
                }
            );
            // The token is set in httpOnly cookie by the backend
            // Just return the success response
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error("Login failed. Please try again.");
        }
        // catch (error: unknown) {
        //     if (axios.isAxiosError(error) && error.response?.data?.error) {
        //         throw new Error(error.response.data.error);
        //     }
        //     throw new Error("Login failed. Please try again.");
        // }
    },
    register: async (username: string, email: string, password: string) => {
        try {
            const response = await api.post(
                "/auth/register",
                { username, email, password },
                { withCredentials: true }
            );
            return response.data; // או return true אם לא צריך כלום
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error("Registration failed. Please try again.");
        }
    },
    logout: async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            localStorage.removeItem("token");
        }
    },
    getCurrentUser: async () => {
        return api.get("/auth/me");
    },
};
