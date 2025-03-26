import { AuthModalProvider } from './context/AuthModalContext';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import AppRouter from './router';

function App() {
    return (
        <AuthModalProvider>
            <UserProvider> {/* Wrap your app with UserProvider */}
                <AppRouter />
            </UserProvider>
        </AuthModalProvider>
    );
}

export default App;
