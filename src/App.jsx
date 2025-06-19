import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AppPage from './pages/AppPage';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      light: '#4FD1C5',
      main: '#38B2AC',
      dark: '#319795',
    },
    secondary: {
      light: '#FBD38D',
      main: '#F6AD55',
      dark: '#ED8936',
    },
    background: {
      default: '#F7FAFC',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const { currentUser } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/app" /> : <LandingPage />} />
        <Route path="/login" element={currentUser ? <Navigate to="/app" /> : <Login />} />
        <Route path="/signup" element={currentUser ? <Navigate to="/app" /> : <Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/app" element={<AppPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
