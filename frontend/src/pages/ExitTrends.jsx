import { useState, useEffect } from 'react';
import { exitTrendAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, TrendingDown, Download } from 'lucide-react';

function ExitTrends() {
  const [trends, setTrends] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, [year]);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await exitTrendAPI.get(year);
      setTrends(response.data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = {
    voluntary: '#C8102E',
    termination: '#FFD700',
    total: '#8B0000',
  };

  const pieData = trends.reduce((acc, item) => {
    const existing = acc.find(d => d.name === 'Voluntary');
    if (existing) {
      existing.value += item.voluntary_exits;
      acc.find(d => d.name === 'Termination').value += item.terminations;
    } else {
      acc.push(
        { name: 'Voluntary', value: item.voluntary_exits },
        { name: 'Termination', value: item.terminations }
      );
    }
    return acc;
  }, []);

  const PIE_COLORS = ['#C8102E', '#FFD700'];

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
            Exit Trends
          </h1>
          <p className="text-gray-400">Quarterly exit analysis and trends</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="input-glossy pl-11"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="glossy-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="table-glossy">
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Voluntary Exits</th>
                <th>Terminations</th>
                <th>Total Exits</th>
                <th>Difference (V - T)</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend) => (
                <tr key={trend.quarter}>
                  <td className="font-semibold text-ironman-gold">{trend.quarter}</td>
                  <td className="text-ironman-red font-bold">{trend.voluntary_exits}</td>
                  <td className="text-ironman-gold font-bold">{trend.terminations}</td>
                  <td className="text-white font-bold">{trend.total_exits}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trend.difference > 0 ? 'bg-ironman-red/20 text-ironman-red' : 
                      trend.difference < 0 ? 'bg-ironman-gold/20 text-ironman-gold' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {trend.difference > 0 ? '+' : ''}{trend.difference}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="glossy-card p-6">
          <h2 className="text-2xl font-bold text-ironman-gold mb-6 flex items-center gap-2">
            <TrendingDown className="w-6 h-6" />
            Quarterly Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C8102E20" />
              <XAxis dataKey="quarter" stroke="#FFD700" />
              <YAxis stroke="#FFD700" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid #C8102E',
                  borderRadius: '8px',
                  color: '#FFD700'
                }}
              />
              <Legend />
              <Bar dataKey="voluntary_exits" fill="#C8102E" name="Voluntary Exits" radius={[8, 8, 0, 0]} />
              <Bar dataKey="terminations" fill="#FFD700" name="Terminations" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glossy-card p-6">
          <h2 className="text-2xl font-bold text-ironman-gold mb-6">Overall Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid #C8102E',
                  borderRadius: '8px',
                  color: '#FFD700'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Difference Line Chart */}
      <div className="glossy-card p-6">
        <h2 className="text-2xl font-bold text-ironman-gold mb-6">Voluntary vs Termination Difference</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#C8102E20" />
            <XAxis dataKey="quarter" stroke="#FFD700" />
            <YAxis stroke="#FFD700" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid #C8102E',
                borderRadius: '8px',
                color: '#FFD700'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="difference" 
              stroke="#C8102E" 
              strokeWidth={3}
              dot={{ fill: '#FFD700', r: 6 }}
              activeDot={{ r: 8 }}
              name="Difference (V - T)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExitTrends;
