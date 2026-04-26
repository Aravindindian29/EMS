import { X, ClipboardList, User, Calendar, Briefcase, Users, Building2, Clock, LogOut } from 'lucide-react';
import { displayValueOrNA, displayTeamOrNA } from '../utils/helpers';

const EmployeeDetailsModal = ({ isOpen, onClose, employeeData }) => {
  if (!isOpen || !employeeData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Full Time':
        return 'bg-teal-500/20 text-teal-400';
      case 'Intern':
        return 'bg-ironman-gold/20 text-ironman-gold';
      case 'Contract':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-400';
      case 'Exited':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glossy-card p-8 max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-ironman-gold/20 to-ironman-gold/30 rounded-xl border border-ironman-gold/30">
              <ClipboardList className="w-7 h-7 text-ironman-gold" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Employee Details</h2>
              <p className="text-gray-400 text-sm">Comprehensive employee information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-ironman-red/20 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6 text-ironman-gold" />
          </button>
        </div>

        {/* Employee Basic Info */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-ironman-dark/60 to-ironman-dark/40 border border-ironman-gold/30 rounded-xl p-6">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-ironman-gold/20 rounded-xl border border-ironman-gold/30">
                <User className="w-6 h-6 text-ironman-gold" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{employeeData.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-ironman-gold text-sm font-semibold mb-1">Employee ID</p>
                    <p className="text-white font-mono">{employeeData.employee_id}</p>
                  </div>
                  <div>
                    <p className="text-ironman-gold text-sm font-semibold mb-1">Title</p>
                    <p className="text-white">{employeeData.title}</p>
                  </div>
                  <div>
                    <p className="text-ironman-gold text-sm font-semibold mb-1">Email</p>
                    <p className="text-white">{employeeData.email}</p>
                  </div>
                  <div>
                    <p className="text-ironman-gold text-sm font-semibold mb-1">Type</p>
                    {employeeData.type ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(employeeData.type)}`}>
                        {employeeData.type}
                      </span>
                    ) : (
                      <span className="text-white">NA</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-ironman-gold" />
            Employment Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-ironman-dark/40 border border-ironman-red/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-ironman-gold" />
                <p className="text-ironman-gold text-sm font-semibold">Date of Joining</p>
              </div>
              <p className="text-white">{formatDate(employeeData.date_of_joining)}</p>
            </div>
            <div className="bg-ironman-dark/40 border border-ironman-red/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-ironman-gold" />
                <p className="text-ironman-gold text-sm font-semibold">Tenure</p>
              </div>
              <p className="text-white">{employeeData.tenure_at_adf || 'N/A'}</p>
            </div>
            <div className="bg-ironman-dark/40 border border-ironman-red/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-ironman-gold" />
                <p className="text-ironman-gold text-sm font-semibold">Prior Experience</p>
              </div>
              <p className="text-white">{employeeData.experience_prior_adf ? `${employeeData.experience_prior_adf} years` : 'N/A'}</p>
            </div>
            <div className="bg-ironman-dark/40 border border-ironman-red/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-ironman-gold" />
                <p className="text-ironman-gold text-sm font-semibold">Status</p>
              </div>
              {employeeData.status ? (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(employeeData.status)}`}>
                  {employeeData.status}
                </span>
              ) : (
                <span className="text-white">NA</span>
              )}
            </div>
          </div>
        </div>

        {/* Organizational Structure */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-ironman-gold" />
            Organizational Structure
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-ironman-dark/40 border border-ironman-red/30 rounded-xl p-4">
              <p className="text-ironman-gold text-sm font-semibold mb-2">Reporting To</p>
              <p className="text-white">{displayValueOrNA(employeeData.reporting_to)}</p>
            </div>
            <div className="bg-ironman-dark/40 border border-ironman-red/30 rounded-xl p-4">
              <p className="text-ironman-gold text-sm font-semibold mb-2">Team</p>
              <p className="text-white">{displayTeamOrNA(employeeData.team_name)}</p>
            </div>
            <div className="bg-ironman-dark/40 border border-ironman-red/30 rounded-xl p-4">
              <p className="text-ironman-gold text-sm font-semibold mb-2">VP India</p>
              <p className="text-white">{displayValueOrNA(employeeData.vp_india)}</p>
            </div>
          </div>
        </div>

        {/* Exit Information (if applicable) */}
        {employeeData.status === 'Exited' && (
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <LogOut className="w-5 h-5 text-red-400" />
              Exit Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-ironman-dark/40 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm font-semibold mb-2">Exit Date</p>
                <p className="text-white">{formatDate(employeeData.exit_date)}</p>
              </div>
              <div className="bg-ironman-dark/40 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm font-semibold mb-2">Exit Type</p>
                <p className="text-white">{employeeData.exit_type || 'N/A'}</p>
              </div>
              <div className="bg-ironman-dark/40 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm font-semibold mb-2">Exit Quarter</p>
                <p className="text-white">{employeeData.exit_quarter || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* System Information */}
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-ironman-gold" />
            System Information
          </h4>
          <div className="bg-ironman-dark/40 border border-ironman-red/30 rounded-xl p-4">
            <p className="text-ironman-gold text-sm font-semibold mb-2">Record Created</p>
            <p className="text-white">{formatDateTime(employeeData.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
