
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
    signOut: () => Promise<void>;
    isSessionValid: () => boolean;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    token: null,
    isAuthenticated: false,
    login: async () => { },
    logout: () => { },
    signOut: async () => { },
    isSessionValid: () => false,
    refreshSession: async () => { },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [session, setSession] = useState<Session | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setToken(session?.access_token || null);
            setIsAuthenticated(!!session);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setToken(session?.access_token || null);
            setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            // Set token after successful login
            if (data.session) {
                setToken(data.session.access_token);
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setToken(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const refreshSession = async () => {
        try {
            const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
            if (error) throw error;
            setSession(newSession);
            setToken(newSession?.access_token || null);
            setIsAuthenticated(!!newSession);
        } catch (error) {
            console.error('Error refreshing session:', error);
            await signOut();
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setSession(null);
            setToken(null);
            setIsAuthenticated(false);
            // Clear any stored data
            localStorage.removeItem('sitemapData');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const isSessionValid = () => {
        if (!session) return false;

        // Check if token exists and is not expired
        const currentToken = session.access_token;
        if (!currentToken) return false;

        try {
            // Decode JWT token
            const tokenPayload = JSON.parse(atob(currentToken.split('.')[1]));
            const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();
            const timeUntilExpiration = expirationTime - currentTime;

            // If token expires in less than 5 minutes, refresh it
            if (timeUntilExpiration < 5 * 60 * 1000) {
                refreshSession();
            }

            return currentTime < expirationTime;
        } catch (error) {
            console.error('Error checking token validity:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            session, 
            token,
            isAuthenticated, 
            login, 
            logout, 
            signOut, 
            isSessionValid, 
            refreshSession 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
