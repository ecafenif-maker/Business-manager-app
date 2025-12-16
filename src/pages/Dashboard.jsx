import { useEffect, useState } from 'react';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        dailySales: 0,
        dailyIncome: 0,
        dailyExpenses: 0,
        balance: 0,
    });
    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Stats
                const { data: statsData } = await api.get('/transactions/stats');

                // Calculate derived stats from aggregation if not pre-calculated
                const sales = statsData.breakdown.find(b => b._id === 'sale')?.total || 0;
                const income = statsData.breakdown.find(b => b._id === 'income')?.total || 0;
                const expenses = statsData.breakdown.find(b => b._id === 'expense')?.total || 0;

                setStats({
                    dailySales: statsData.dailySales,
                    dailyIncome: statsData.dailyIncome,
                    totalIncome: income + sales,
                    totalExpenses: expenses,
                    balance: (income + sales) - expenses
                });

                // Fetch Recent Transactions
                const { data: txData } = await api.get('/transactions?limit=5');
                setRecentTransactions(txData);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        fetchData();
    }, []);

    // Placeholder data for chart
    const data = [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 5000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 6890 },
        { name: 'Sat', sales: 8390 },
        { name: 'Sun', sales: 7490 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-500">Overview of your daily operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Daily Sales" value={`$${stats.dailySales.toLocaleString()}`} />
                <StatCard title="Net Balance" value={`$${stats.balance.toLocaleString()}`} />
                <StatCard title="Total Income" value={`$${stats.totalIncome.toLocaleString()}`} />
                <StatCard title="Total Expenses" value={`$${stats.totalExpenses.toLocaleString()}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Sales Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="sales" stroke="#2563eb" fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {recentTransactions.map(tx => (
                            <div key={tx._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${tx.type === 'expense' ? 'bg-red-500' : 'bg-green-500'
                                        }`} />
                                    <div>
                                        <p className="font-medium text-gray-900 capitalize">{tx.type}</p>
                                        <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`font-semibold ${tx.type === 'expense' ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                    {tx.type === 'expense' ? '-' : '+'}${tx.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
