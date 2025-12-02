import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('https://gella.cloudindustrie.com/api/auth/me', {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await fetch('https://gella.cloudindustrie.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await res.json();
        setUser(data.user);
        return data.user;
    };

    const signup = async (username, email, password) => {
        const res = await fetch('https://gella.cloudindustrie.com/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, email, password }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Signup failed');
        }

        const data = await res.json();
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        await fetch('https://gella.cloudindustrie.com/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
    };

    const updateCredits = (newCredits) => {
        if (user) {
            setUser({ ...user, credits: newCredits });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                updateCredits,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
