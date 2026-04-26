import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';

function Login({ setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-ironman-darker via-black to-ironman-dark">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-ironman-red/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-ironman-gold/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"></div>
      </div>

      <div className="glossy-card w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ironman-red to-ironman-darkRed rounded-full mb-4 shadow-glossy pulse-glow">
            <Shield className="w-10 h-10 text-ironman-gold" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ironman-red via-ironman-gold to-ironman-red bg-clip-text text-transparent">
            Employee Management
          </h1>
          <p className="text-gray-400 mt-2">Professional Edition</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ironman-gold mb-2">
              Username
            </label>
            <div className="relative">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-glossy w-full pl-11"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ironman-gold mb-2">
              Password
            </label>
            <div className="relative">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-glossy w-full pl-11"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/password-reset" className="text-ironman-gold hover:text-ironman-lightGold transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="loading-spinner w-5 h-5"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-ironman-gold hover:text-ironman-lightGold font-semibold transition-colors">
            Sign up
          </Link>
        </div>

        <div className="mt-8 p-4 bg-ironman-gold/10 border border-ironman-gold/30 rounded-lg">
          <p className="text-xs text-ironman-gold font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-300">Admin: admin / admin123</p>
          <p className="text-xs text-gray-300">User: user / user123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
