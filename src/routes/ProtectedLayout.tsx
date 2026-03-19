import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const ProtectedLayout = () => {
    const { userToken, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!userToken)
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    return <Outlet />;
};
