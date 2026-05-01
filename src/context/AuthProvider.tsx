import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Pet } from "../types";
import { logged, myPets } from "../api/axios";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../socket/socketService";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  // 🔹 1. Usuario logueado
  const { data, isLoading: loadingUser } = useQuery({
    queryKey: ["auth"],
    queryFn: logged,
    select: (data) => ({
      userToken: data.user.id,
      petId: data.petId ? data.petId : null,
    }),
    staleTime: 1000 * 60 * 5, // 5 min
    refetchOnWindowFocus: false,
  });

  // 🔹 2. Mascota del usuario
  const { data: petData, isLoading: loadingPet } = useQuery({
    queryKey: ["myPets"],
    queryFn: myPets,
  });

  const pet: Pet | null = petData ? petData[0] : null;

  // 🔹 Loading global
  const loading = loadingUser || loadingPet;

  // 🔹 Refresh manual (como tenías antes)
  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["auth"] });
    await queryClient.invalidateQueries({ queryKey: ["myPets"] });
  };
  useEffect(() => {
    if (data?.userToken) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [data?.userToken]);
  return (
    <AuthContext.Provider
      value={{
        userToken: data?.userToken,
        pet,
        petId: data?.petId,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
