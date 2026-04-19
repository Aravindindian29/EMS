import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { employeeAPI, teamAPI, vpIndiaAPI, reportingManagerAPI } from '../services/api';

function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    title: '',
    name: '',
    email: '',
    date_of_joining: '',
    experience_prior_adf: '',
    type: '',
    status: 'Active',
    reporting_to: '',
    team: '',
    vp_india: '',
  });

  const [teams, setTeams] = useState([]);
  const [vpIndiaList, setVpIndiaList] = useState([]);
  const [reportingManagers, setReportingManagers] = useState([]);
  const [tenure, setTenure] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.date_of_joining) {
      calculateTenure(formData.date_of_joining);
    }
  }, [formData.date_of_joining]);

  const fetchDropdownData = async () => {
    try {
      const [teamsRes, vpRes, rmRes] = await Promise.all([
        teamAPI.getAll(),
        vpIndiaAPI.getAll(),
        reportingManagerAPI.getAll(),
      ]);
      setTeams(Array.isArray(teamsRes.data) ? teamsRes.data : teamsRes.data.results || []);
      setVpIndiaList(Array.isArray(vpRes.data) ? vpRes.data : vpRes.data.results || []);
      setReportingManagers(Array.isArray(rmRes.data) ? rmRes.data : rmRes.data.results || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const calculateTenure = (doj) => {
    const startDate = new Date(doj);
    const today = new Date();
    
    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0 && months > 0) {
      setTenure(`${years}y ${months}m`);
    } else if (years > 0) {
      setTenure(`${years}y`);
    } else {
      setTenure(`${months}m`);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employee_id.trim()) newErrors.employee_id = 'Employee ID is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.date_of_joining) newErrors.date_of_joining = 'Date of Joining is required';
    if (!formData.experience_prior_adf) newErrors.experience_prior_adf = 'Prior Experience is required';
    else if (isNaN(formData.experience_prior_adf) || parseFloat(formData.experience_prior_adf) < 0) {
      newErrors.experience_prior_adf = 'Prior Experience must be a positive number';
    }
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.status) newErrors.status = 'Status is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        experience_prior_adf: parseFloat(formData.experience_prior_adf),
        team: formData.team || null,
        reporting_to: formData.reporting_to || null,
        vp_india: formData.vp_india || null,
      };

      await employeeAPI.create(submitData);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating employee:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      employee_id: '',
      title: '',
      name: '',
      email: '',
      date_of_joining: '',
      experience_prior_adf: '',
      type: '',
      status: 'Active',
      reporting_to: '',
      team: '',
      vp_india: '',
    });
    setTenure('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  console.log('AddEmployeeModal rendering', { teams, vpIndiaList, reportingManagers });

  let teamOptions = [];
  let vpOptions = [];
  let rmOptions = [];

  try {
    teamOptions = (teams || []).map(team => ({
      value: team.id,
      label: team.team_name
    }));

    vpOptions = (vpIndiaList || []).map(vp => ({
      value: vp.name,
      label: vp.name
    }));

    rmOptions = (reportingManagers || []).map(rm => ({
      value: rm.name,
      label: rm.name
    }));
  } catch (error) {
    console.error('Error creating dropdown options:', error);
  }

  try {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose}></div>
        
        <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto glossy-card p-8 m-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-ironman-red via-ironman-gold to-ironman-red bg-clip-text text-transparent">
              Add Employee
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-ironman-red/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-ironman-gold" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Emp ID <span className="text-ironman-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employee_id}
                  onChange={(e) => handleChange('employee_id', e.target.value)}
                  className="input-glossy w-full"
                  placeholder="Enter Employee ID"
                />
                {errors.employee_id && <p className="text-red-400 text-sm mt-1">{errors.employee_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Title <span className="text-ironman-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="input-glossy w-full"
                  placeholder="Enter Title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Name <span className="text-ironman-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="input-glossy w-full"
                  placeholder="Enter Name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email <span className="text-ironman-red">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="input-glossy w-full"
                  placeholder="Enter Email"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  DOJ <span className="text-ironman-red">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date_of_joining}
                  onChange={(e) => handleChange('date_of_joining', e.target.value)}
                  className="input-glossy w-full"
                />
                {errors.date_of_joining && <p className="text-red-400 text-sm mt-1">{errors.date_of_joining}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Tenure
                </label>
                <input
                  type="text"
                  value={tenure}
                  readOnly
                  className="input-glossy w-full bg-ironman-dark/40 cursor-not-allowed"
                  placeholder="Auto-calculated"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Prior Exp (years) <span className="text-ironman-red">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.experience_prior_adf}
                  onChange={(e) => handleChange('experience_prior_adf', e.target.value)}
                  className="input-glossy w-full"
                  placeholder="Enter Prior Experience"
                />
                {errors.experience_prior_adf && <p className="text-red-400 text-sm mt-1">{errors.experience_prior_adf}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Type <span className="text-ironman-red">*</span>
                </label>
                <CustomSelect
                  value={formData.type}
                  onChange={(value) => handleChange('type', value)}
                  options={[
                    { value: 'Full Time', label: 'Full Time' },
                    { value: 'Intern', label: 'Intern' },
                    { value: 'Contract', label: 'Contract' },
                  ]}
                  placeholder="Select Type"
                />
                {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Status <span className="text-ironman-red">*</span>
                </label>
                <CustomSelect
                  value={formData.status}
                  onChange={(value) => handleChange('status', value)}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Exited', label: 'Exited' },
                  ]}
                  placeholder="Select Status"
                />
                {errors.status && <p className="text-red-400 text-sm mt-1">{errors.status}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Reporting To
                </label>
                <CustomSelect
                  value={formData.reporting_to}
                  onChange={(value) => handleChange('reporting_to', value)}
                  options={[
                    { value: '', label: 'None' },
                    ...rmOptions
                  ]}
                  placeholder="Select Reporting Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Team
                </label>
                <CustomSelect
                  value={formData.team}
                  onChange={(value) => handleChange('team', value)}
                  options={[
                    { value: '', label: 'None' },
                    ...teamOptions
                  ]}
                  placeholder="Select Team"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  VP India
                </label>
                <CustomSelect
                  value={formData.vp_india}
                  onChange={(value) => handleChange('vp_india', value)}
                  options={[
                    { value: '', label: 'None' },
                    ...vpOptions
                  ]}
                  placeholder="Select VP India"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Adding...' : 'Add Employee'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering AddEmployeeModal:', error);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose}></div>
        <div className="relative z-10 glossy-card p-8 m-4">
          <h2 className="text-xl text-red-400 mb-4">Error loading form</h2>
          <p className="text-gray-300 mb-4">There was an error loading the employee form.</p>
          <button onClick={handleClose} className="btn-secondary">Close</button>
        </div>
      </div>
    );
  }
}

export default AddEmployeeModal;
