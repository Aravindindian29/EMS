import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { employeeAPI } from '../services/api';

function ExitDetailsModal({ isOpen, onClose, quarter }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && quarter) {
      fetchExitDetails();
    }
  }, [isOpen, quarter]);

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
  }, [employees]);

  const fetchExitDetails = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getByExitQuarter(quarter);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching exit details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glossy-card w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-ironman-red/30">
          <div className="pl-3">
            <h2 className="text-2xl font-bold text-ironman-gold">
              Exit Details - {quarter}
            </h2>
            <p className="text-gray-400 mt-0">
              {employees.length} employee{employees.length !== 1 ? 's' : ''} exited
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ironman-red/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-ironman-gold" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="loading-spinner"></div>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No employees exited in this quarter</p>
            </div>
          ) : (
            <div className="employee-table-container">
              <div className="table-header-container">
                <table className="table-glossy">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Title</th>
                      <th>Exit Type</th>
                      <th>Exit Date</th>
                      <th>Team</th>
                      <th>Reporting Manager</th>
                      <th>Tenure</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className={`table-body-container ${employees.length > 3 ? 'max-h-[200px] overflow-y-auto custom-scrollbar' : ''}`}>
                <table className="table-glossy">
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td className="font-semibold text-ironman-gold">{emp.employee_id}</td>
                        <td className="text-white">{emp.name}</td>
                        <td className="text-white">{emp.title}</td>
                        <td>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            emp.exit_type === 'Voluntary' 
                              ? 'bg-ironman-gold/20 text-ironman-gold' 
                              : 'bg-ironman-red/20 text-ironman-red'
                          }`}>
                            {emp.exit_type || 'N/A'}
                          </span>
                        </td>
                        <td className="text-white">
                          {emp.exit_date ? new Date(emp.exit_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="text-white">{emp.team_name || 'N/A'}</td>
                        <td className="text-white">{emp.reporting_to || 'N/A'}</td>
                        <td className="text-white">{emp.tenure_at_adf || 'N/A'}</td>
                        <td className="text-white">{emp.type || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExitDetailsModal;
