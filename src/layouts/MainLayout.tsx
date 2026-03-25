import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Props {
    children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
    return (
        <div className="min-h-screen max-w-6xl mx-auto p-4 text-primaryText font-content">
            <Navbar />
            <Outlet />
            <div className=" mt-6">{children}</div>
        </div>
    );
}
