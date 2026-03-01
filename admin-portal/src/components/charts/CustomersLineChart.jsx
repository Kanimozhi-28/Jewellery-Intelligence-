import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function CustomersLineChart({ data }) {
    if (!data || data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">No visit data available</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                />
                <Line type="monotone" dataKey="customers" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}
