import { AuthModalProvider } from './context/AuthModalContext';
import AppRouter from './router';

function App() {
    return (
        <AuthModalProvider>
            <AppRouter />
        </AuthModalProvider>
    );
}

export default App;
