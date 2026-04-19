import { useState } from 'react';
import { employeeAPI } from '../services/api';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

function AdminPanel() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a CSV or Excel file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    try {
      const response = await employeeAPI.import(file);
      setResult(response.data);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to import file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-ironman-red via-ironman-gold to-ironman-red bg-clip-text text-transparent mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-400">Manage employee data and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Section */}
        <div className="glossy-card p-6">
          <h2 className="text-2xl font-bold text-ironman-gold mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Import Employees
          </h2>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-ironman-red/30 rounded-lg p-8 text-center hover:border-ironman-gold/50 transition-colors">
              <FileSpreadsheet className="w-16 h-16 text-ironman-gold mx-auto mb-4" />
              <p className="text-gray-300 mb-4">
                Upload CSV or Excel file with employee data
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="btn-secondary inline-block cursor-pointer"
              >
                Choose File
              </label>
              {file && (
                <p className="mt-4 text-ironman-gold text-sm">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <div className="flex items-center gap-2 text-green-200 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">{result.message}</span>
                </div>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                    <p className="text-red-300 text-sm font-semibold mb-2">Errors:</p>
                    <ul className="text-red-200 text-xs space-y-1">
                      {result.errors.slice(0, 5).map((err, idx) => (
                        <li key={idx}>• {err}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>... and {result.errors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="loading-spinner w-5 h-5"></div>
                  <span>Importing...</span>
                </div>
              ) : (
                'Import Data'
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="glossy-card p-6">
          <h2 className="text-2xl font-bold text-ironman-gold mb-6">Import Instructions</h2>
          
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Required Columns:</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>employee_id</li>
                <li>title</li>
                <li>name</li>
                <li>email</li>
                <li>date_of_joining (YYYY-MM-DD)</li>
                <li>type (Full Time/Intern/Contract)</li>
                <li>status (Active/Exited)</li>
                <li>reporting_to</li>
                <li>team</li>
                <li>vp_india</li>
                <li>experience_prior_adf (decimal)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Optional Columns:</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>exit_date (YYYY-MM-DD)</li>
                <li>exit_type (Voluntary/Termination)</li>
                <li>us_team_head</li>
                <li>india_head</li>
              </ul>
            </div>

            <div className="p-4 bg-ironman-gold/10 border border-ironman-gold/30 rounded-lg">
              <p className="text-xs text-ironman-gold">
                <strong>Note:</strong> Teams will be created automatically if they don't exist.
                Duplicate employee IDs or emails will be skipped.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
