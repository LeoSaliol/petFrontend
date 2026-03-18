import { useEffect, useState } from 'react';
import type { User } from '../types';
import { logged } from '../api/axios';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        try {
            const response = await logged();
            setUser(response?.data || null);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
        }
    };
    useEffect(() => {
        const init = async () => {
            await getUser();
            setLoading(false);
        };
        init();
    }, []);
    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser: getUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
