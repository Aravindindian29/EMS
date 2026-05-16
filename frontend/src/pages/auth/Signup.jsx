import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Shield, User, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    // Clear field-specific error when user starts typing
    setFieldErrors({ ...fieldErrors, [name]: '' });

    // Real-time validation
    if (name === 'email' && value) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(value)) {
        setFieldErrors({ ...fieldErrors, [name]: 'Please enter a valid email address' });
      }
    }

    if (name === 'username' && value) {
      const usernamePattern = /^[a-zA-Z0-9]+$/;
      if (!usernamePattern.test(value)) {
        setFieldErrors({ ...fieldErrors, [name]: 'Username can only contain letters and numbers' });
      }
    }

    if (name === 'password' && value) {
      if (value.length < 8) {
        setFieldErrors({ ...fieldErrors, [name]: 'Must be at least 8 characters long' });
      }
    }

    if (name === 'password2' && value) {
      if (value.length < 8) {
        setFieldErrors({ ...fieldErrors, [name]: 'Must be at least 8 characters long' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Check for empty required fields
    const errors = {};
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else {
      const usernamePattern = /^[a-zA-Z0-9]+$/;
      if (!usernamePattern.test(formData.username)) {
        errors.username = 'Username can only contain letters and numbers';
      }
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Must be at least 8 characters long';
    }
    if (!formData.password2) {
      errors.password2 = 'Confirm password is required';
    } else if (formData.password2.length < 8) {
      errors.password2 = 'Must be at least 8 characters long';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password2) {
      setFieldErrors({ ...fieldErrors, password2: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      await authAPI.signup(formData);
      navigate('/login');
    } catch (err) {
      const errors = {};
      const responseData = err.response?.data;

      if (responseData?.email) {
        errors.email = Array.isArray(responseData.email) ? responseData.email[0] : responseData.email;
      }
      if (responseData?.username) {
        errors.username = Array.isArray(responseData.username) ? responseData.username[0] : responseData.username;
      }
      if (responseData?.first_name) {
        errors.first_name = Array.isArray(responseData.first_name) ? responseData.first_name[0] : responseData.first_name;
      }
      if (responseData?.last_name) {
        errors.last_name = Array.isArray(responseData.last_name) ? responseData.last_name[0] : responseData.last_name;
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
      } else {
        setError(err.response?.data?.detail || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 bg-gradient-to-br from-ironman-darker via-black to-ironman-dark">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-ironman-red/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-ironman-gold/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"></div>
      </div>

      <div className="glossy-card w-full max-w-2xl p-4 relative z-10">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ironman-red to-ironman-darkRed rounded-full mb-3 shadow-glossy pulse-glow">
            <Shield className="w-10 h-10 text-ironman-gold" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ironman-red via-ironman-gold to-ironman-red bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2">Join the Employee Management System</p>
        </div>

        {error && (
          <div className="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ironman-gold mb-0.5">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input-glossy w-full"
                placeholder="Enter First Name"
                maxLength="50"
              />
              {fieldErrors.first_name && (
                <p className="text-red-400 text-xs mt-0.5">{fieldErrors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ironman-gold mb-0.5">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input-glossy w-full"
                placeholder="Enter Last Name"
                maxLength="50"
              />
              {fieldErrors.last_name && (
                <p className="text-red-400 text-xs mt-0.5">{fieldErrors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ironman-gold mb-0.5">
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
                  placeholder="Enter Username"
                  maxLength="50"
                />
              </div>
            </div>
            {fieldErrors.username && (
              <p className="text-red-400 text-xs mt-0.5">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ironman-gold mb-0.5">
              Email Address
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
                  placeholder="Enter Email Address"
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  maxLength="150"
                />
              </div>
            </div>
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-0.5">{fieldErrors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ironman-gold mb-0.5">
                Password
              </label>
              <div className="relative">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-glossy w-full pl-11 pr-11"
                    placeholder="XXXX"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ironman-gold transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {fieldErrors.password && (
                <p className="text-red-400 text-xs mt-0.5">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ironman-gold mb-0.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    className="input-glossy w-full pl-11 pr-11"
                    placeholder="XXXX"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ironman-gold transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {fieldErrors.password2 && (
                <p className="text-red-400 text-xs mt-0.5">{fieldErrors.password2}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-2/3 mx-auto block disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="mt-4 text-center text-sm text-gray-400">
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
