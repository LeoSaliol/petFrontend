import { useEffect, useState } from 'react';
import type { Pet, User } from '../types';
import { logged, myPets } from '../api/axios';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userToken, setUserToken] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [pet, setPet] = useState<Pet | null>(null);

    const getUser = async () => {
        try {
            const response = await logged();
            setUserToken(response?.data || null);
            if (response?.data) {
                const userData = await myPets();
                setPet(userData[0]);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserToken(null);
            setPet(null);
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
                userToken,
                pet,
                loading,
                refreshUser: getUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
