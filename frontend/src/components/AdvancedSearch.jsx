import { useState, useEffect } from 'react';
import { Search, Calendar, Users, User, Building2, Filter, X } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { employeeAPI, teamAPI } from '../services/api';

const AdvancedSearch = ({ onSearch, onReset, onClose }) => {
  const [teams, setTeams] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchFilters, setSearchFilters] = useState({
    employee_id: '',
    name: '',
    reporting_to: '',
    vp_india: '',
    doj: '',
    tenure: '',
    team: '',
    type: '',
    status: ''
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const validateDOJ = (doj) => {
    if (!doj) return ''; // Empty is valid
    
    // Check YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(doj)) {
      return 'Date must be in YYYY-MM-DD format';
    }
    
    // Check if it's a valid date
    const date = new Date(doj);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Check if the date components match (prevents 2023-02-30 from being valid)
    const [year, month, day] = doj.split('-').map(Number);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      return 'Invalid date';
    }
    
    return ''; // No error
  };

  const validateTenure = (tenure) => {
    if (!tenure) return ''; // Empty is valid
    
    // Check tenure format (e.g., "2y", "6m", "2y 3m")
    const tenureRegex = /^(\d+y\s*\d+m|\d+y|\d+m)$/;
    if (!tenureRegex.test(tenure.trim())) {
      return 'Format: "2y", "6m", or "2y 3m"';
    }
    
    return ''; // No error
  };

  const validateMinLength = (value, fieldName) => {
    if (!value) return ''; // Empty is valid
    
    if (value.trim().length < 3) {
      return 'Please enter at least 3 characters';
    }
    
    return ''; // No error
  };

  const handleInputChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validate text fields for minimum length
    if (['employee_id', 'name', 'reporting_to', 'vp_india'].includes(field)) {
      const error = validateMinLength(value, field);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
    
    // Validate DOJ field
    if (field === 'doj') {
      const error = validateDOJ(value);
      setErrors(prev => ({
        ...prev,
        doj: error
      }));
    }
    
    // Validate tenure field
    if (field === 'tenure') {
      const error = validateTenure(value);
      setErrors(prev => ({
        ...prev,
        tenure: error
      }));
    }
  };

  const handleSearch = () => {
    // Validate text fields for minimum length
    const textFields = ['employee_id', 'name', 'reporting_to', 'vp_india'];
    for (const field of textFields) {
      if (searchFilters[field]) {
        const error = validateMinLength(searchFilters[field], field);
        if (error) {
          setErrors(prev => ({ ...prev, [field]: error }));
          return; // Don't search if any field has insufficient characters
        }
      }
    }
    
    // Validate DOJ before searching
    const dojError = validateDOJ(searchFilters.doj);
    if (dojError) {
      setErrors(prev => ({ ...prev, doj: dojError }));
      return; // Don't search if DOJ is invalid
    }
    
    // Validate tenure before searching
    const tenureError = validateTenure(searchFilters.tenure);
    if (tenureError) {
      setErrors(prev => ({ ...prev, tenure: tenureError }));
      return; // Don't search if tenure is invalid
    }
    
    const filters = Object.fromEntries(
      Object.entries(searchFilters).filter(([_, v]) => v !== '')
    );
    onSearch(filters);
  };

  const handleReset = () => {
    setSearchFilters({
      employee_id: '',
      name: '',
      reporting_to: '',
      vp_india: '',
      doj: '',
      tenure: '',
      team: '',
      type: '',
      status: ''
    });
    setErrors({});
    onReset();
  };

  const hasActiveFilters = Object.values(searchFilters).some(value => value !== '');

  return (
    <div className="glossy-card p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-ironman-gold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Advanced Search
        </h2>
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Close Advanced Search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Employee ID */}
        <div className="relative mb-6">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Employee ID (exact match)"
            value={searchFilters.employee_id}
            onChange={(e) => handleInputChange('employee_id', e.target.value)}
            className={`input-glossy w-full pl-10 ${
              errors.employee_id ? 'border-red-500 focus:border-red-500' : ''
            }`}
          />
          {errors.employee_id && (
            <div className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.employee_id}
            </div>
          )}
        </div>

        {/* Name */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Employee Name (partial match)"
            value={searchFilters.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`input-glossy w-full pl-10 ${
              errors.name ? 'border-red-500 focus:border-red-500' : ''
            }`}
          />
          {errors.name && (
            <div className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.name}
            </div>
          )}
        </div>

        {/* Reporting To */}
        <div className="relative mb-6">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Reporting To (partial match)"
            value={searchFilters.reporting_to}
            onChange={(e) => handleInputChange('reporting_to', e.target.value)}
            className={`input-glossy w-full pl-10 ${
              errors.reporting_to ? 'border-red-500 focus:border-red-500' : ''
            }`}
          />
          {errors.reporting_to && (
            <div className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.reporting_to}
            </div>
          )}
        </div>

        {/* VP India */}
        <div className="relative mb-6">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="VP India (partial match)"
            value={searchFilters.vp_india}
            onChange={(e) => handleInputChange('vp_india', e.target.value)}
            className={`input-glossy w-full pl-10 ${
              errors.vp_india ? 'border-red-500 focus:border-red-500' : ''
            }`}
          />
          {errors.vp_india && (
            <div className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.vp_india}
            </div>
          )}
        </div>

        {/* DOJ */}
        <div className="relative mb-6">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Date of Joining (YYYY-MM-DD)"
            value={searchFilters.doj}
            onChange={(e) => handleInputChange('doj', e.target.value)}
            className={`input-glossy w-full pl-10 ${
              errors.doj ? 'border-red-500 focus:border-red-500' : ''
            }`}
          />
          {errors.doj && (
            <div className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.doj}
            </div>
          )}
        </div>

        {/* Tenure */}
        <div className="relative mb-6">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tenure (e.g., 2y, 6m, 2y 3m)"
            value={searchFilters.tenure}
            onChange={(e) => handleInputChange('tenure', e.target.value)}
            className={`input-glossy w-full pl-10 ${
              errors.tenure ? 'border-red-500 focus:border-red-500' : ''
            }`}
          />
          {errors.tenure && (
            <div className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.tenure}
            </div>
          )}
        </div>

        {/* Team */}
        <CustomSelect
          value={searchFilters.team}
          onChange={(value) => handleInputChange('team', value)}
          options={[
            { value: "", label: "All Teams" },
            ...teams.map(team => ({
              value: team.id.toString(),
              label: team.team_name
            }))
          ]}
          placeholder="Select Team"
          className="w-full"
        />

        {/* Type */}
        <CustomSelect
          value={searchFilters.type}
          onChange={(value) => handleInputChange('type', value)}
          options={[
            { value: "", label: "All Types" },
            { value: "Full Time", label: "Full Time" },
            { value: "Intern", label: "Intern" },
            { value: "Contract", label: "Contract" }
          ]}
          placeholder="Select Type"
          className="w-full"
        />

        {/* Status */}
        <CustomSelect
          value={searchFilters.status}
          onChange={(value) => handleInputChange('status', value)}
          options={[
            { value: "", label: "All Status" },
            { value: "Active", label: "Active" },
            { value: "Exited", label: "Exited" }
          ]}
          placeholder="Select Status"
          className="w-full"
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSearch}
          className="btn-primary flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          onClick={handleReset}
          className="btn-secondary flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default AdvancedSearch;
