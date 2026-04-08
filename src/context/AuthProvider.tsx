// import { useEffect, useState } from 'react';
// import type { Pet } from '../types';
// import { logged, myPets } from '../api/axios';
// import { AuthContext } from './AuthContext';

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [userToken, setUserToken] = useState<number | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [pet, setPet] = useState<Pet | null>(null);

//     const getUser = async () => {
//         try {
//             const response = await logged();
//             setUserToken(response);
//             if (response) {
//                 const petData = await myPets();

//                 setPet(petData[0]);
//             }
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//             setUserToken(null);
//             setPet(null);
//         }
//     };
//     useEffect(() => {
//         const init = async () => {
//             await getUser();
//             setLoading(false);
//         };
//         init();
//     }, []);
//     return (
//         <AuthContext.Provider
//             value={{
//                 userToken,
//                 pet,
//                 loading,
//                 refreshUser: getUser,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Pet } from '../types';
import { logged, myPets } from '../api/axios';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();

    // 🔹 1. Usuario logueado
    const { data: userToken, isLoading: loadingUser } = useQuery({
        queryKey: ['auth'],
        queryFn: logged,
        staleTime: 1000 * 60 * 5, // 5 min
        refetchOnWindowFocus: false,
    });

    // 🔹 2. Mascota del usuario
    const { data: petData, isLoading: loadingPet } = useQuery({
        queryKey: ['myPets'],
        queryFn: myPets,
    });

    const pet: Pet | null = petData ? petData[0] : null;

    // 🔹 Loading global
    const loading = loadingUser || loadingPet;

    // 🔹 Refresh manual (como tenías antes)
    const refreshUser = async () => {
        await queryClient.invalidateQueries({ queryKey: ['auth'] });
        await queryClient.invalidateQueries({ queryKey: ['myPets'] });
    };

    return (
        <AuthContext.Provider
            value={{
                userToken: userToken ?? null,
                pet,
                loading,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
