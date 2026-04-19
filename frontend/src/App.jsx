import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import PasswordReset from './pages/auth/PasswordReset';
import Dashboard from './pages/Dashboard';
import ActiveEmployees from './pages/ActiveEmployees';
import ExitTrends from './pages/ExitTrends';
import TeamWiseCount from './pages/TeamWiseCount';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/layout/Layout';
import ToastManager from './components/ToastManager';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
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
        </Route>
      </Routes>
      <ToastManager />
    </Router>
  );
}

export default App;
