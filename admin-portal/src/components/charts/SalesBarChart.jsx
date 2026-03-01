import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useData } from '../../context/DataContext';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-3 shadow-lg ring-1 ring-black/5">
                <p className="text-sm font-semibold">{label}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <p className="text-sm text-muted-foreground">
                        Sales: <span className="font-medium text-foreground">₹{payload[0].value.toLocaleString('en-IN')}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function SalesBarChart() {
    const { salespersons } = useData();
    const data = salespersons.map(sp => ({
        name: sp.name.split(' ')[0],
        sales: sp.sales,
        fullSales: `₹${sp.sales.toLocaleString('en-IN')}`
    }));

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 5, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                    height={40}
                />
                <YAxis
                    className="text-xs"
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Bar
                    dataKey="sales"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                >
                    <LabelList dataKey="fullSales" position="top" className="text-xs font-medium fill-foreground" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
