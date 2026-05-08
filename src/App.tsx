import { useNotifications } from "./hooks/userNotifications";
import MainLayout from "./layouts/MainLayout";

interface AppProps {
  children: React.ReactNode;
}

function App({ children }: AppProps) {
  useNotifications();

  return (
    <div className="bg-primaryWhite dark:bg-primaryBlack text-primaryBlack dark:text-primaryWhite min-h-screen">
      <MainLayout>{children}</MainLayout>
    </div>
  );
}

export default App;