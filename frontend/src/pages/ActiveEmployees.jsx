import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import { Search, Filter, Download, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import AdvancedSearch from '../components/AdvancedSearch';
import AddEmployeeModal from '../components/AddEmployeeModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import EmployeeDetailsModal from '../components/EmployeeDetailsModal';
import { displayValueOrNA, displayTeamOrNA } from '../utils/helpers';

// Utility function to truncate email addresses to 20 characters with periods
const truncateEmail = (email) => {
  if (!email) return '';
  
  if (email.length <= 20) {
    return email;
  }
  
  return email.substring(0, 17) + '...';
};

function ActiveEmployees({ user }) {
  const [searchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [employeeToView, setEmployeeToView] = useState(null);
  
  // Read URL parameters immediately on initial state setup
  const typeParam = searchParams.get('type');
  const statusParam = searchParams.get('status');
  
  const [filters, setFilters] = useState({ 
    type: typeParam || '', 
    status: statusParam || '', 
    team: '' 
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, [search, filters, page, advancedFilters]);

  // Synchronize horizontal scrolling from body to header
  useEffect(() => {
    const headerContainer = document.querySelector('.table-header-container');
    const bodyContainer = document.querySelector('.table-body-container');
    
    if (!headerContainer || !bodyContainer) return;
    
    const handleBodyScroll = (e) => {
      headerContainer.scrollLeft = bodyContainer.scrollLeft;
    };
    
    bodyContainer.addEventListener('scroll', handleBodyScroll);
    
    // Initial sync
    headerContainer.scrollLeft = bodyContainer.scrollLeft;
    
    return () => {
      bodyContainer.removeEventListener('scroll', handleBodyScroll);
    };
  }, [employees]); // Re-bind when employees data changes

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // Use advanced search if advanced filters are applied
      if (Object.keys(advancedFilters).length > 0) {
        const params = {
          page,
          page_size: 20,
          ...advancedFilters,
        };
        const response = await employeeAPI.advancedSearch(params);
        setEmployees(response.data.results || response.data);
        setTotalEmployees(response.data.count || response.data.length);
        setTotalPages(Math.ceil((response.data.count || response.data.length) / 20));
      } else {
        // Use regular search for basic search and filters
        const params = {
          search,
          page,
          page_size: 20,
          ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '')),
        };
        const response = await employeeAPI.getAll(params);
        setEmployees(response.data.results || response.data);
        setTotalEmployees(response.data.count || response.data.length);
        setTotalPages(Math.ceil((response.data.count || response.data.length) / 20));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSearch = (searchFilters) => {
    setAdvancedFilters(searchFilters);
    setPage(1); // Reset to first page when searching
  };

  const handleResetAdvancedSearch = () => {
    setAdvancedFilters({});
    setPage(1); // Reset to first page when resetting
  };

  const handleCloseAdvancedSearch = () => {
    setShowAdvancedSearch(false);
    setAdvancedFilters({});
    setPage(1); // Reset to first page when closing
  };

  const handleAddSuccess = () => {
    fetchEmployees();
  };

  const handleExport = async (format = 'csv', event) => {
    try {
      // Show loading state
      if (event && event.target) {
        const originalText = event.target.innerText;
        event.target.innerHTML = '<span class="loading-spinner"></span> Exporting...';
        event.target.disabled = true;
      }

      const exportFilters = Object.keys(advancedFilters).length > 0 ? advancedFilters : filters;
      console.log('Exporting with filters:', exportFilters);
      
      const response = await employeeAPI.export({ format, ...exportFilters });
      console.log('Export response:', response);
      
      // Check if response has data
      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Create blob from response data
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.${format}`);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
      // Show success message
      if (window.showToast) {
        window.showToast(`Employee data exported successfully as ${format.toUpperCase()}!`, 'success', 3000);
      }
      
    } catch (error) {
      console.error('Error exporting:', error);
      
      // Show error message
      if (window.showToast) {
        window.showToast(`Failed to export data: ${error.message || 'Unknown error'}`, 'error', 5000);
      } else {
        alert(`Failed to export data: ${error.message || 'Unknown error'}`);
      }
    } finally {
      // Restore button state
      if (event.target) {
        event.target.innerHTML = '<Download className="w-5 h-5" />Export CSV';
        event.target.disabled = false;
      }
    }
  };

  const handleEditClick = (employee) => {
    setEmployeeToEdit(employee);
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEmployeeToEdit(null);
  };

  const handleEditSuccess = () => {
    // Refresh the employee list to show updated data
    fetchEmployees();
  };

  const handleEmployeeClick = (employee) => {
    setEmployeeToView(employee);
    setShowDetailsModal(true);
  };

  const handleDetailsClose = () => {
    setShowDetailsModal(false);
    setEmployeeToView(null);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    setIsDeleting(true);
    try {
      await employeeAPI.delete(employeeToDelete.id);
      
      // Show success toast
      if (window.showToast) {
        window.showToast(`Employee "${employeeToDelete.name}" details has been successfully deleted!`, 'success', 4000);
      }
      
      // Remove the deleted employee from the local state
      setEmployees(prevEmployees => 
        prevEmployees.filter(emp => emp.id !== employeeToDelete.id)
      );
      
      // Update total count
      setTotalEmployees(prev => prev - 1);
      
      // Close the modal and reset state
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      
    } catch (error) {
      console.error('Error deleting employee:', error);
      // You could add a toast notification here
      alert('Failed to delete employee. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-ironman-red via-ironman-gold to-ironman-red bg-clip-text text-transparent mb-2">
            Employee Details
          </h1>
          <p className="text-gray-400">Manage and view employee data</p>
        </div>
        <div className="flex items-center gap-4">
          {Object.keys(advancedFilters).length > 0 && (
            <span className="text-ironman-gold text-sm">
              {Object.keys(advancedFilters).length} filter{Object.keys(advancedFilters).length > 1 ? 's' : ''} applied
            </span>
          )}
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="btn-secondary flex items-center gap-2"
          >
            {showAdvancedSearch ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5" />}
            {showAdvancedSearch ? 'Basic Search' : 'Advanced Search'}
          </button>
          {isAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Employee Details
            </button>
          )}
        </div>
      </div>

      {/* Advanced Search */}
      {showAdvancedSearch ? (
        <AdvancedSearch
          onSearch={handleAdvancedSearch}
          onReset={handleResetAdvancedSearch}
          onClose={handleCloseAdvancedSearch}
        />
      ) : (
        /* Basic Filters */
        <div className="glossy-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-glossy w-full pl-11"
                />
              </div>
            </div>

            <CustomSelect
              value={filters.type}
              onChange={(value) => setFilters({ ...filters, type: value })}
              options={[
                { value: "", label: "All Type" },
                { value: "Full Time", label: "Full Time" },
                { value: "Intern", label: "Intern" },
                { value: "Contract", label: "Contract" }
              ]}
              placeholder="All Type"
              className="w-full"
            />

            <CustomSelect
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              options={[
                { value: "", label: "All Status" },
                { value: "Active", label: "Active" },
                { value: "Exited", label: "Exited" }
              ]}
              placeholder="Select Status"
              className="w-full"
            />

            <button
              onClick={(e) => handleExport('csv', e)}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glossy-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-400 text-center">
              <div className="mb-4">
                <Search className="w-16 h-16 mx-auto text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Results Found</h3>
              <p className="text-gray-500">
                No employees match your search criteria.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="employee-table-container">
              <div className="table-header-container">
                <table className="table-glossy">
                  <thead>
                    <tr>
                      <th>Emp ID</th>
                      <th>Title</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>DOJ</th>
                      <th>Tenure</th>
                      <th>Prior Exp</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Reporting To</th>
                      <th>Team</th>
                      <th>VP India</th>
                      {isAdmin && <th>Actions</th>}
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="table-body-container">
                <table className="table-glossy">
                  <tbody>
                    {employees.map((emp) => (
                      <tr 
                        key={emp.id}
                        onClick={() => handleEmployeeClick(emp)}
                        className="cursor-pointer hover:bg-ironman-gold/10 transition-colors"
                      >
                        <td className="font-mono text-ironman-gold">{emp.employee_id}</td>
                        <td>{emp.title}</td>
                        <td className="font-semibold">{emp.name}</td>
                        <td title={emp.email}>{truncateEmail(emp.email)}</td>
                        <td>{new Date(emp.date_of_joining).toLocaleDateString()}</td>
                        <td className="text-ironman-gold">{emp.tenure_at_adf}</td>
                        <td>{emp.experience_prior_adf} yrs</td>
                        <td>
                          {emp.type ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              emp.type === 'Full Time' ? 'bg-teal-500/20 text-teal-400' :
                              emp.type === 'Intern' ? 'bg-ironman-gold/20 text-ironman-gold' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {emp.type}
                            </span>
                          ) : (
                            'NA'
                          )}
                        </td>
                        <td>
                          {emp.status ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              emp.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {emp.status}
                            </span>
                          ) : (
                            'NA'
                          )}
                        </td>
                        <td>{displayValueOrNA(emp.reporting_to)}</td>
                        <td>{displayTeamOrNA(emp.team_name)}</td>
                        <td>{displayValueOrNA(emp.vp_india)}</td>
                        {isAdmin && (
                          <td onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleEditClick(emp)}
                                className="p-2 hover:bg-ironman-gold/20 rounded-lg transition-colors"
                                title="Edit Employee"
                              >
                                <Edit className="w-4 h-4 text-ironman-gold" />
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(emp)}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Delete Employee"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-6">
              <p className="text-gray-400">
                Showing {totalEmployees} employees
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-ironman-dark/50 hover:bg-ironman-red/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-ironman-gold" />
                </button>
                <span className="px-4 py-2 bg-ironman-dark/50 rounded-lg text-ironman-gold">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-ironman-dark/50 hover:bg-ironman-red/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-ironman-gold" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
      
      <AddEmployeeModal
        isOpen={showEditModal}
        mode="edit"
        employeeData={employeeToEdit}
        onClose={handleEditCancel}
        onSuccess={handleEditSuccess}
      />
      
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        employeeName={employeeToDelete?.name || ''}
        employeeId={employeeToDelete?.employee_id || ''}
        isDeleting={isDeleting}
      />
      
      <EmployeeDetailsModal
        isOpen={showDetailsModal}
        onClose={handleDetailsClose}
        employeeData={employeeToView}
      />
    </div>
  );
}

export default ActiveEmployees;
