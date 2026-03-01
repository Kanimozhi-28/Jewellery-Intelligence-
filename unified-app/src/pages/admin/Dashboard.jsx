import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import {
    Users, ShoppingBag, TrendingUp, Clock,
    MapPin, Eye, ArrowUpRight, ArrowDownRight,
    TrendingDown, Percent
} from 'lucide-react';

const TREND_DATA = [
    { name: 'Mon', sales: 4000, interactions: 2400 },
    { name: 'Tue', sales: 3000, interactions: 1398 },
    { name: 'Wed', sales: 2000, interactions: 9800 },
    { name: 'Thu', sales: 2780, interactions: 3908 },
    { name: 'Fri', sales: 1890, interactions: 4800 },
    { name: 'Sat', sales: 2390, interactions: 3800 },
    { name: 'Sun', sales: 3490, interactions: 4300 },
];

const CATEGORY_DATA = [
    { name: 'Rings', value: 400 },
    { name: 'Earrings', value: 300 },
    { name: 'Chains', value: 200 },
    { name: 'Bracelets', value: 100 },
];

const COLORS = ['#d4af37', '#b8c6db', '#a8a8a8', '#f1d592'];

const KpiCard = ({ title, value, detail, icon: Icon, color, trend }) => (
    <div className="glass rounded-[32px] p-6 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-bl-[80px]`}></div>
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors`}>
                <Icon size={24} className="text-gold" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(trend)}%
            </div>
        </div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black mb-1">{value}</h3>
        <p className="text-gray-600 text-[10px] font-medium italic">{detail}</p>
    </div>
);

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 italic">Dashboard</h1>
                    <p className="text-gray-500 font-medium">Real-time Retail Intelligence Overview</p>
                </div>
                <div className="flex gap-4">
                    <button className="glass px-6 py-3 rounded-2xl text-sm font-bold border-white/5 hover:bg-white/10 transition-all">Today</button>
                    <button className="gold-gradient px-6 py-3 rounded-2xl text-sm font-bold text-black shadow-lg hover:scale-105 transition-all">Export PDF</button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Total Customers"
                    value="1,482"
                    detail="+42 from same time yesterday"
                    icon={Users}
                    color="bg-gold"
                    trend={12}
                />
                <KpiCard
                    title="Conversion Rate"
                    value="24.8%"
                    detail="Avg. across all zones"
                    icon={Percent}
                    color="bg-blue-500"
                    trend={4}
                />
                <KpiCard
                    title="Revenue"
                    value="₹4.2M"
                    detail="Target: ₹5.0M"
                    icon={TrendingUp}
                    color="bg-green-500"
                    trend={8}
                />
                <KpiCard
                    title="Lost Opps"
                    value="182"
                    detail="Items shown vs not sold"
                    icon={TrendingDown}
                    color="bg-red-500"
                    trend={-2}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Sales Chart */}
                <div className="lg:col-span-2 glass rounded-[40px] p-8 border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold">Sales & Interactions</h3>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gold"></div> Sales</span>
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white/20"></div> Visitors</span>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={TREND_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                />
                                <Line type="monotone" dataKey="sales" stroke="#d4af37" strokeWidth={4} dot={{ fill: '#d4af37', r: 6 }} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="interactions" stroke="#ffffff20" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Split */}
                <div className="glass rounded-[40px] p-8 border border-white/5 relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-8">Interaction Share</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={CATEGORY_DATA}
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {CATEGORY_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-8">
                        {CATEGORY_DATA.map((cat, i) => (
                            <div key={cat.name} className="flex justify-between items-center group cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{cat.name}</span>
                                </div>
                                <span className="text-sm font-black text-white">{cat.value} views</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
