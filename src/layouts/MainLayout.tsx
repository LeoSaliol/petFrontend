import Navbar from "../components/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="font-content mx-auto min-h-screen max-w-7xl p-4">
      <Navbar />
      <main className="mt-6">{children}</main>
    </div>
  );
}