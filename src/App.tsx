import { useNotifications } from "./hooks/userNotifications";
import MainLayout from "./layouts/MainLayout";
interface Props {
  children: React.ReactNode;
}
function App({ children }: Props) {
  useNotifications();
  return (
    <div className="bg-background dark:bg-primaryText text-primaryText dark:text-background">
      <MainLayout children={children} />
    </div>
  );
}

export default App;
