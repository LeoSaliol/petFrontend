import MainLayout from './layouts/MainLayout';
interface Props {
    children: React.ReactNode;
}
function App({ children }: Props) {
    return (
        <div className="bg-background">
            <MainLayout children={children} />
        </div>
    );
}

export default App;
