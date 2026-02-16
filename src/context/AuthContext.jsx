import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    if (response.data.success) {
                        setUser(response.data.data);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                const { token, user: userData } = response.data.data;
                localStorage.setItem('token', token);
                setUser(userData);
                toast.success('Login Successful!');
                return userData;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return null;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            if (response.data.success) {
                const { token, user: registeredUser } = response.data.data;
                localStorage.setItem('token', token);
                setUser(registeredUser);
                toast.success('Registration Successful!');
                return registeredUser;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const updateProfile = async (userData) => {
        try {
            const response = await api.put('/auth/updatedetails', userData);
            if (response.data.success) {
                setUser(response.data.data);
                toast.success('Profile updated successfully!');
                return true;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Update failed';
            toast.error(message);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
