import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield } from 'lucide-react';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import PasswordReset from './pages/auth/PasswordReset';
import Dashboard from './pages/Dashboard';
import ActiveEmployees from './pages/ActiveEmployees';
import ExitTrends from './pages/ExitTrends';
import TeamWiseCount from './pages/TeamWiseCount';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Layout from './components/layout/Layout';
import ToastManager from './components/ToastManager';
import { isTokenExpired } from './utils/helpers';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        // No tokens found, user is not authenticated
        setLoading(false);
        return;
      }

      // Check if access token is expired
      if (isTokenExpired(token)) {
        // Token is expired, try to refresh it
        if (refreshToken && !isTokenExpired(refreshToken)) {
          try {
            const API_URL = 'http://localhost:8000/api';
            const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
              refresh: refreshToken,
            });

            const { access } = response.data;
            localStorage.setItem('access_token', access);
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
          } catch (refreshError) {
            // Refresh failed, clear tokens and keep user logged out
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // Refresh token is also expired or missing, clear everything
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // Token is valid, set authentication state
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ironman-darker via-black to-ironman-dark">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ironman-red to-ironman-darkRed rounded-full mb-4 shadow-glossy pulse-glow">
              <Shield className="w-10 h-10 text-ironman-gold" />
            </div>
            <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
            <p className="text-ironman-gold font-semibold">Verifying authentication...</p>
          </div>
        </div>
      );
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ironman-darker via-black to-ironman-dark">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ironman-red to-ironman-darkRed rounded-full mb-4 shadow-glossy pulse-glow">
              <Shield className="w-10 h-10 text-ironman-gold" />
            </div>
            <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
            <p className="text-ironman-gold font-semibold">Verifying authentication...</p>
          </div>
        </div>
      );
    }
    return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        
        <Route path="/" element={<PrivateRoute><Layout user={user} setIsAuthenticated={setIsAuthenticated} /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<ActiveEmployees user={user} />} />
          <Route path="exit-trends" element={<ExitTrends />} />
          <Route path="teams" element={<TeamWiseCount />} />
          <Route path="admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="profile" element={<Profile user={user} setUser={setUser} />} />
        </Route>
      </Routes>
      <ToastManager />
    </Router>
  );
}

export default App;
