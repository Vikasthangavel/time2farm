import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, AUTH_TOKEN_KEY, setAuthToken } from '../api/client';

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
                    if (response.token) {
                        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
                        setAuthToken(response.token);
                    }
                    return;
                }

                const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
                if (storedToken) {
                    setAuthToken(storedToken);
                    const restoreResponse = await authAPI.restoreSession(storedToken);
                    if (restoreResponse.success && restoreResponse.token) {
                        localStorage.setItem(AUTH_TOKEN_KEY, restoreResponse.token);
                        setAuthToken(restoreResponse.token);
                        const restoredSession = await authAPI.checkSession();
                        if (restoredSession.valid && restoredSession.user) {
                            setUser(restoredSession.user);
                            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(restoredSession.user));
                            return;
                        }
                    }
                }

                localStorage.removeItem(AUTH_STORAGE_KEY);
                localStorage.removeItem(AUTH_TOKEN_KEY);
                setAuthToken(null);
            } catch (error) {
                console.error('Session check failed', error);
                localStorage.removeItem(AUTH_STORAGE_KEY);
                localStorage.removeItem(AUTH_TOKEN_KEY);
                setAuthToken(null);
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
            if (response.token) {
                localStorage.setItem(AUTH_TOKEN_KEY, response.token);
                setAuthToken(response.token);
            }
            return true;
        }
        return false;
    };

    /**
     * Called after Google credential is obtained.
     * Returns { success, needs_profile, google_email, google_name, google_sub }
     * If needs_profile is false, the user is already logged in.
     */
    const googleLogin = async (idToken) => {
        const response = await authAPI.googleAuth(idToken);
        if (response.success && !response.needs_profile && response.user) {
            setUser(response.user);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
            if (response.token) {
                localStorage.setItem(AUTH_TOKEN_KEY, response.token);
                setAuthToken(response.token);
            }
        }
        return response; // let caller inspect needs_profile
    };

    /**
     * Called after new Google user fills in their username/farm details.
     */
    const googleComplete = async (profileData) => {
        const response = await authAPI.googleComplete(profileData);
        if (response.success && response.user) {
            setUser(response.user);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
            if (response.token) {
                localStorage.setItem(AUTH_TOKEN_KEY, response.token);
                setAuthToken(response.token);
            }
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
            localStorage.removeItem(AUTH_TOKEN_KEY);
            setAuthToken(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, googleLogin, googleComplete, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
