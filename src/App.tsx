import './App.css';
import { AppRoutes } from './routes/routes';
import { useAuthToken } from './auth/use-auth-token';

function App() {
   useAuthToken();
   return <AppRoutes />
}

export default App;