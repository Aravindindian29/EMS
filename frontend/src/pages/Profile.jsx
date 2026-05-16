import { useState } from 'react';
import { User, Lock, Mail, Shield, Pencil, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';

function Profile({ user, setUser }) {
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [nameData, setNameData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || ''
  });
  const [nameLoading, setNameLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      window.showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.new_password.length < 8) {
      window.showToast('New password must be at least 8 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      window.showToast('Password changed successfully', 'success');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to change password';
      window.showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setNameData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setNameData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || ''
    });
  };

  const validateName = (value) => {
    if (value.length > 50) {
      return 'Name must be 50 characters or less';
    }
    if (value && !/^[a-zA-Z\s\'-]+$/.test(value)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return '';
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const firstNameError = validateName(nameData.first_name);
    const lastNameError = validateName(nameData.last_name);
    
    if (firstNameError) {
      window.showToast(firstNameError, 'error');
      return;
    }
    if (lastNameError) {
      window.showToast(lastNameError, 'error');
      return;
    }
    
    if (!nameData.first_name && !nameData.last_name) {
      window.showToast('At least one name field must be provided', 'error');
      return;
    }

    setNameLoading(true);
    try {
      const response = await authAPI.updateProfile({
        first_name: nameData.first_name,
        last_name: nameData.last_name
      });
      
      setUser({ ...user, ...response.data });
      window.showToast('Profile updated successfully', 'success');
      setEditingField(null);
    } catch (error) {
      const errorMessage = error.response?.data?.non_field_errors?.[0] || 
                          error.response?.data?.first_name?.[0] || 
                          error.response?.data?.last_name?.[0] || 
                          'Failed to update profile';
      window.showToast(errorMessage, 'error');
    } finally {
      setNameLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-ironman-red via-ironman-gold to-ironman-red bg-clip-text text-transparent mb-2">
          Profile
        </h1>
        <p className="text-gray-400">View and manage your profile settings</p>
      </div>

      {/* Profile Information Card */}
      <div className="glossy-card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
          <User className="w-5 h-5 text-ironman-gold" />
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ironman-gold opacity-60" />
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="input-glossy w-full pl-11 opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ironman-gold opacity-60" />
              <input
                type="text"
                value={user?.email || ''}
                disabled
                className="input-glossy w-full pl-11 opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
            {editingField === 'first_name' ? (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ironman-gold" />
                <input
                  type="text"
                  value={nameData.first_name}
                  onChange={(e) => setNameData({ ...nameData, first_name: e.target.value })}
                  className="bg-ironman-dark border border-ironman-red/30 rounded-lg px-4 py-3 text-white pl-11 w-full focus:outline-none focus:border-ironman-gold focus:ring-2 focus:ring-ironman-gold/50 transition-all bg-ironman-darker/50"
                  maxLength={50}
                  disabled={nameLoading}
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-ironman-darker/50 rounded-lg border border-ironman-red/20">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-ironman-gold" />
                  <span className="text-white">{user?.first_name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleEditField('first_name')}
                  className="p-1 hover:bg-ironman-red/20 rounded transition-colors"
                  disabled={editingField !== null}
                >
                  <Pencil className="w-4 h-4 text-ironman-gold" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
            {editingField === 'last_name' ? (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ironman-gold" />
                <input
                  type="text"
                  value={nameData.last_name}
                  onChange={(e) => setNameData({ ...nameData, last_name: e.target.value })}
                  className="bg-ironman-dark border border-ironman-red/30 rounded-lg px-4 py-3 text-white pl-11 w-full focus:outline-none focus:border-ironman-gold focus:ring-2 focus:ring-ironman-gold/50 transition-all bg-ironman-darker/50"
                  maxLength={50}
                  disabled={nameLoading}
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-ironman-darker/50 rounded-lg border border-ironman-red/20">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-ironman-gold" />
                  <span className="text-white">{user?.last_name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleEditField('last_name')}
                  className="p-1 hover:bg-ironman-red/20 rounded transition-colors"
                  disabled={editingField !== null}
                >
                  <Pencil className="w-4 h-4 text-ironman-gold" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ironman-gold opacity-60" />
              <input
                type="text"
                value={user?.role || ''}
                disabled
                className="input-glossy w-full pl-11 opacity-60 cursor-not-allowed capitalize"
              />
            </div>
          </div>
        </div>

        {editingField && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn-primary"
              disabled={nameLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProfileUpdate}
              className="btn-secondary"
              disabled={nameLoading}
            >
              {nameLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="glossy-card p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2 justify-center">
          <Lock className="w-5 h-5 text-ironman-gold" />
          Change Password
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                className="input-glossy w-full max-w-md pr-11"
                required
                maxLength={128}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ironman-gold transition-colors"
                disabled={loading}
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                className="input-glossy w-full max-w-md pr-11"
                required
                minLength={8}
                maxLength={128}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ironman-gold transition-colors"
                disabled={loading}
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                className="input-glossy w-full max-w-md pr-11"
                required
                maxLength={128}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ironman-gold transition-colors"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
