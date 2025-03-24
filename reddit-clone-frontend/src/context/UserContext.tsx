import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../services/api';

interface User {
    username: string;
    email: string;
    karma: number;
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => void;
    login: (email: string, password: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await auth.getCurrentUser();
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await auth.login(email, password);
        if (response.message === "Login successful") {
            await fetchUser(); // Fetch user data after successful login
        } else {
            throw new Error("Login failed");
        }
    };

    const logout = () => {
        auth.logout();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, isLoading, logout, login }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};