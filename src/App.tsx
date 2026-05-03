import { useNotifications } from "./hooks/userNotifications";
import MainLayout from "./layouts/MainLayout";
interface Props {
  children: React.ReactNode;
}
function App({ children }: Props) {
  useNotifications();
  return (
    <div className="bg-primaryWhite dark:bg-primaryBlack text-primaryBlack dark:text-primaryWhite">
      <MainLayout children={children} />
    </div>
  );
}

export default App;
