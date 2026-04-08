import { useTheme } from './hooks/useDarkTheme';
import { useNotifications } from './hooks/userNotifications';
import MainLayout from './layouts/MainLayout';
interface Props {
    children: React.ReactNode;
}
function App({ children }: Props) {
    const { theme, toggleTheme } = useTheme();
    useNotifications();
    return (
        <div className="bg-background dark:bg-primaryText ">
            <button onClick={toggleTheme}>
                {theme === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
            </button>
            <MainLayout children={children} />
        </div>
    );
}

export default App;
