import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'time2farm.auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await authAPI.checkSession();
                if (response.valid && response.user) {
                    setUser(response.user);
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
                    return;
                }

                const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser?.id) {
                        const restoreResponse = await authAPI.restoreSession(parsedUser.id);
                        if (restoreResponse.success) {
                            setUser(parsedUser);
                            return;
                        }
                    }
                }

                localStorage.removeItem(AUTH_STORAGE_KEY);
            } catch (error) {
                console.error('Session check failed', error);
                localStorage.removeItem(AUTH_STORAGE_KEY);
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
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
            return true;
        }
        return false;
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } finally {
            setUser(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
