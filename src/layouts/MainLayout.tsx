import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="font-content mx-auto min-h-screen max-w-7xl p-4">
      <Navbar />
      <Outlet />
      <div className="mt-6">{children}</div>
    </div>
  );
}
