/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { socket } from '../socket';
import { useAuth } from '../context/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export const useNotifications = () => {
    const { pet } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!pet?.id) return;

        socket.emit('join', pet.id);

        socket.on('notification', (data) => {
            console.log('🔔 Nueva notificación:', data);

            // actualizar cache
            queryClient.setQueryData(['notifications'], (old: any) => {
                return [data, ...(old || [])];
            });
        });

        return () => {
            socket.off('notification');
        };
    }, [pet?.id, queryClient]);
};
