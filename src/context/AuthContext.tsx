import { createContext } from 'react';

type User = {
    id: number;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refreshUser: async () => {},
});
