import React from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, IndianRupee, Clock, UserCheck } from 'lucide-react';
import { CustomersLineChart } from '../components/charts/CustomersLineChart';
import { SalesBarChart } from '../components/charts/SalesBarChart';
import { TrafficPieChart } from '../components/charts/TrafficPieChart';
import { HeatmapChart } from '../components/charts/HeatmapChart';

const MetricCard = ({ title, value, subtext, icon: Icon, percentage }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {title}
            </CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">
                {subtext}
            </p>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const { metrics, loading } = useData();

    if (loading || !metrics) {
        return <div className="p-8 text-center text-muted-foreground">Loading dashboard data...</div>;
    }

    // Adapt backend metrics to UI expectations
    const displayMetrics = {
        totalCustomers: {
            today: metrics.total_customers || 0,
            week: (metrics.total_customers || 0) * 1.5 // Rough estimation for now
        },
        totalSales: (metrics.total_sales_sessions || 0) * 125000,
        avgTimePerCustomer: `${metrics.avg_time_per_customer || 0}m`,
        attendedPercentage: metrics.attended_percentage || 0,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Customers"
                    value={displayMetrics.totalCustomers.today}
                    subtext="+2 from yesterday"
                    icon={Users}
                />
                <MetricCard
                    title="Est. Total Sales"
                    value={`₹${displayMetrics.totalSales.toLocaleString('en-IN')}`}
                    subtext="Based on completed sessions"
                    icon={IndianRupee}
                />
                <MetricCard
                    title="Avg Time"
                    value={displayMetrics.avgTimePerCustomer}
                    subtext="-2m from last week"
                    icon={Clock}
                />
                <MetricCard
                    title="Attended %"
                    value={`${displayMetrics.attendedPercentage}%`}
                    subtext="Target: 90%"
                    icon={UserCheck}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Daily Customer Visits</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <CustomersLineChart data={metrics.daily_visits} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Sales Consultant Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SalesBarChart />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Floor-wise Visitor Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TrafficPieChart data={metrics.floor_distribution} />
                    </CardContent>
                </Card>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Daily Peak Activity Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HeatmapChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
