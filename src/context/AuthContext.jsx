import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await authAPI.checkSession();
                if (response.valid && response.user) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error('Session check failed', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = async (username, password) => {
        const response = await authAPI.login(username, password);
        if (response.success && response.user) {
            setUser(response.user);
            return true;
        }
        return false;
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
