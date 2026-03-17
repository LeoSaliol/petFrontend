import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { User } from '../types';

export const useUser = () => {
    const [user, setUser] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users');
                const data = await response.data;
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};
