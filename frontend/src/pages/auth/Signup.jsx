import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Shield, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
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

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authAPI.signup(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.username?.[0] || 'Signup failed. Please try again.');
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

      <div className="glossy-card w-full max-w-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ironman-red to-ironman-darkRed rounded-full mb-4 shadow-glossy pulse-glow">
            <Shield className="w-10 h-10 text-ironman-gold" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ironman-red via-ironman-gold to-ironman-red bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2">Join the Employee Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ironman-gold mb-2">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input-glossy w-full"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ironman-gold mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input-glossy w-full"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ironman-gold mb-2">
              Username
            </label>
            <div className="relative">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-glossy w-full pl-11"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ironman-gold mb-2">
              Email
            </label>
            <div className="relative">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-glossy w-full pl-11"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ironman-gold mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    className="input-glossy w-full pl-11"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="loading-spinner w-5 h-5"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-ironman-gold hover:text-ironman-lightGold font-semibold transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
