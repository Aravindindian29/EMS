import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import { Search, Filter, Download, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

function ActiveEmployees({ user }) {
  const [searchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Read URL parameters immediately on initial state setup
  const typeParam = searchParams.get('type');
  const statusParam = searchParams.get('status');
  
  const [filters, setFilters] = useState({ 
    type: typeParam || '', 
    status: statusParam || 'Active', 
    team: '' 
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, [search, filters, page]);

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
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      const response = await employeeAPI.export({ format, ...filters });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-ironman-red via-ironman-gold to-ironman-red bg-clip-text text-transparent mb-2">
            Active Employees
          </h1>
          <p className="text-gray-400">Manage and view employee data</p>
        </div>
        {isAdmin && (
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Employee
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glossy-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glossy w-full pl-11"
            />
          </div>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="input-glossy"
          >
            <option value="">All Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Intern">Intern</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-glossy"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Exited">Exited</option>
          </select>

          <button
            onClick={() => handleExport('csv')}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glossy-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
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
                      <tr key={emp.id}>
                        <td className="font-mono text-ironman-gold">{emp.employee_id}</td>
                        <td>{emp.title}</td>
                        <td className="font-semibold">{emp.name}</td>
                        <td className="text-gray-400">{emp.email}</td>
                        <td>{new Date(emp.date_of_joining).toLocaleDateString()}</td>
                        <td className="text-ironman-gold">{emp.tenure_at_adf}</td>
                        <td>{emp.experience_prior_adf} yrs</td>
                        <td>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.type === 'Full Time' ? 'bg-ironman-red/20 text-ironman-red' :
                            emp.type === 'Intern' ? 'bg-ironman-gold/20 text-ironman-gold' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {emp.type}
                          </span>
                        </td>
                        <td>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td>{emp.reporting_to}</td>
                        <td>{emp.team_name}</td>
                        <td>{emp.vp_india}</td>
                        {isAdmin && (
                          <td>
                            <div className="flex gap-2">
                              <button className="p-2 hover:bg-ironman-gold/20 rounded-lg transition-colors">
                                <Edit className="w-4 h-4 text-ironman-gold" />
                              </button>
                              <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
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
    </div>
  );
}

export default ActiveEmployees;
