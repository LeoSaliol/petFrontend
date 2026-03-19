import { createContext } from 'react';
import type { Pet } from '../types';

type UserToken = {
    id: number;
};

type AuthContextType = {
    userToken: UserToken | null;
    pet: Pet | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    userToken: null,
    pet: null,
    loading: true,
    refreshUser: async () => {},
});
