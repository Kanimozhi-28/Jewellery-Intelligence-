import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#10b981'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-3 shadow-lg ring-1 ring-black/5">
                <p className="text-sm font-semibold">{label}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                    <p className="text-sm text-muted-foreground">
                        Interactions: <span className="font-medium text-foreground">{payload[0].value}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function TopJewelsChart({ data }) {
    if (!data || data.length === 0) {
        return <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm italic">No jewel interaction data available yet.</div>;
    }

    // Sort to ensure highest is first for better visualization if not already sorted
    const sortedData = [...data].sort((a, b) => b.count - a.count);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart layout="vertical" data={sortedData} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                    width={90}
                />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Bar
                    dataKey="count"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={40}
                >
                    {sortedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
