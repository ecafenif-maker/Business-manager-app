import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ name: 'Business Owner', email: 'owner@business.com', token: 'mock-token' });
    const [loading, setLoading] = useState(false);

    // No need to fetch user from local storage or server as we are bypassing auth

    const login = async (email, password) => {
        // Mock login
        console.log('Login bypassed');
    };

    const register = async (name, email, password) => {
        // Mock register
        console.log('Register bypassed');
    };

    const logout = () => {
        // Mock logout - do nothing or maybe refresh?
        console.log('Logout bypassed');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
