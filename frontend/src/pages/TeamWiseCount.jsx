import { useState, useEffect } from 'react';
import { teamAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Search, Download } from 'lucide-react';

function TeamWiseCount() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTeams();
  }, [search]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await teamAPI.getAll({ search });
      setTeams(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await teamAPI.export();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `teams_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-ironman-red via-ironman-gold to-ironman-red bg-clip-text text-transparent mb-2">
            Team Wise Count
          </h1>
          <p className="text-gray-400">Employee distribution across teams</p>
        </div>
      </div>

      {/* Search and Export */}
      <div className="glossy-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glossy w-full pl-11"
            />
          </div>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glossy-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="table-glossy">
            <thead>
              <tr>
                <th>US Team Head</th>
                <th>India Head</th>
                <th>Team Name</th>
                <th>Employee Count</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td className="font-semibold">{team.us_team_head}</td>
                  <td className="font-semibold">{team.india_head}</td>
                  <td className="text-ironman-gold font-bold">{team.team_name}</td>
                  <td>
                    <span className="px-4 py-2 bg-gradient-to-r from-ironman-red/20 to-ironman-gold/20 rounded-full text-white font-bold">
                      {team.employee_count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="glossy-card p-6">
        <h2 className="text-2xl font-bold text-ironman-gold mb-6 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Team Distribution
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={teams} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#C8102E20" />
            <XAxis type="number" stroke="#FFD700" />
            <YAxis dataKey="team_name" type="category" stroke="#FFD700" width={150} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid #C8102E',
                borderRadius: '8px',
                color: '#FFD700'
              }}
            />
            <Legend />
            <Bar 
              dataKey="employee_count" 
              fill="url(#colorGradient)" 
              name="Employee Count"
              radius={[0, 8, 8, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C8102E" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TeamWiseCount;
