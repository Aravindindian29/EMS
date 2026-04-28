import { useState, useEffect, useMemo } from 'react';
import { exitTrendAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, TrendingDown, Download } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import ExitDetailsModal from '../components/ExitDetailsModal';

function ExitTrends() {
  const [trends, setTrends] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2020;
    const endYear = currentYear;
    const options = [];
    for (let y = startYear; y <= endYear; y++) {
      options.push({ value: y.toString(), label: y.toString() });
    }
    return options;
  }, []);

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

  const handleQuarterClick = (quarter) => {
    setSelectedQuarter(quarter);
    setModalOpen(true);
  };

  const COLORS = {
    voluntary: '#FFD700',
    termination: '#C8102E',
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

  const PIE_COLORS = ['#FFD700', '#C8102E'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1A] border border-[#C8102E] rounded-lg p-3">
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.name === 'Termination' ? '#C8102E' : '#FFD700', fontWeight: 'bold' }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
            Exit Trends
          </h1>
          <p className="text-gray-400">Quarterly exit analysis and trends</p>
        </div>
        <div className="flex gap-4">
          <div className="w-30">
            <CustomSelect
              value={year.toString()}
              onChange={(value) => setYear(Number(value))}
              options={yearOptions}
              placeholder="Select Year"
            />
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
              </tr>
            </thead>
            <tbody>
              {trends.map((trend) => (
                <tr 
                  key={trend.quarter}
                  className="cursor-pointer hover:bg-ironman-red/10 transition-colors"
                  onClick={() => handleQuarterClick(trend.quarter)}
                >
                  <td className="font-semibold text-ironman-gold transition-colors">
                    {trend.quarter}
                  </td>
                  <td className="text-ironman-gold font-bold">{trend.voluntary_exits}</td>
                  <td className="text-ironman-red font-bold">{trend.terminations}</td>
                  <td className="text-white font-bold">{trend.total_exits}</td>
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
                cursor={{ stroke: '#C8102E', strokeWidth: 2, fill: '#C8102E', fillOpacity: 0.1 }}
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid #C8102E',
                  borderRadius: '8px',
                  color: '#FFD700'
                }}
              />
              <Legend />
              <Bar dataKey="voluntary_exits" fill="#FFD700" name="Voluntary Exits" radius={[8, 8, 0, 0]} />
              <Bar dataKey="terminations" fill="#C8102E" name="Terminations" radius={[8, 8, 0, 0]} />
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
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ExitDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        quarter={selectedQuarter}
      />

    </div>
  );
}

export default ExitTrends;
