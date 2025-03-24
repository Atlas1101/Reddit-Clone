import { createContext, useContext, useState, ReactNode } from 'react';
import Login from '../components/Login';

interface AuthModalContextType {
    showLogin: boolean;
    setShowLogin: (show: boolean) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <AuthModalContext.Provider value={{ showLogin, setShowLogin }}>
            {children}
            <div className={`fixed inset-0 z-50 ${showLogin ? 'block' : 'hidden'}`}>
                {showLogin && <Login onClose={() => setShowLogin(false)} />}
            </div>
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (context === undefined) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
}