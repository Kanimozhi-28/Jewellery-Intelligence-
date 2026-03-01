import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#10b981'];

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 4}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                cornerRadius={4}
            />
        </g>
    );
};

export function TrafficPieChart({ data: rawData }) {
    const [activeIndex, setActiveIndex] = useState(null);

    // Map raw data to include colors
    const chartData = (rawData || []).map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length]
    }));

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    if (!chartData || chartData.length === 0) {
        return <div className="h-[320px] flex items-center justify-center text-muted-foreground">No traffic data available</div>;
    }

    return (
        <div className="flex flex-col items-center justify-between h-[320px] w-full p-2">

            {/* Top: Chart */}
            <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                            paddingAngle={5}
                            cornerRadius={5}
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            cursor={false}
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderColor: '#e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                color: '#1e293b',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#0f172a', fontWeight: '600' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom: Legend */}
            <div className="w-full flex flex-wrap justify-center gap-4 pb-2">
                {chartData.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-2 group p-1 px-2 rounded-lg transition-colors cursor-pointer ${activeIndex === index ? 'bg-slate-50' : ''}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <div
                            className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-transparent group-hover:ring-gray-200 transition-all"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors whitespace-nowrap">
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
