import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    token: null,
    login: async () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('vextor-token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

    useEffect(() => {
        setIsAuthenticated(!!token);

        if (token) {
            localStorage.setItem('vextor-token', token);
        } else {
            localStorage.removeItem('vextor-token');
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();

            setToken(data.user.session.access_token);
            setIsAuthenticated(true);

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};