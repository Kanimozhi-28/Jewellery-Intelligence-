import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Sparkles, TrendingUp, Award, Users, ShoppingBag, IndianRupee, CheckCircle2, ArrowRight, Star } from 'lucide-react';

export default function AIHotlead() {
    const { customers, salespersons, sessions } = useData();
    const [assignments, setAssignments] = useState({});

    // Calculate high-value customers based on purchase history
    const highValueCustomers = useMemo(() => {
        const customerStats = {};

        sessions.forEach(session => {
            const custId = session.customer_id || (session.customer && session.customer.id);
            if (!custId) return;

            if (!customerStats[custId]) {
                customerStats[custId] = {
                    customer: session.customer || customers.find(c => c.id === custId),
                    totalPurchases: 0,
                    totalValue: 0,
                    itemsPurchased: 0
                };
            }

            if (session.details) {
                session.details.forEach(detail => {
                    if (detail.action === 'Sold' || detail.action === 'Purchased') {
                        customerStats[custId].totalPurchases++;
                        customerStats[custId].totalValue += 125000; // Estimated value per item
                        customerStats[custId].itemsPurchased++;
                    }
                });
            }
        });

        return Object.values(customerStats)
            .filter(stat => stat.itemsPurchased > 0)
            .sort((a, b) => b.totalValue - a.totalValue)
            .slice(0, 8);
    }, [sessions, customers]);

    // Calculate top-rated salespersons
    const topSalespersons = useMemo(() => {
        return salespersons
            .map(sp => ({
                ...sp,
                rating: sp.sales > 500000 ? 5 : sp.sales > 300000 ? 4.5 : sp.sales > 100000 ? 4 : 3.5,
                availability: sp.status === 'Active' ? 'Available' : 'Busy'
            }))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 8);
    }, [salespersons]);

    // Generate AI recommendations
    const recommendations = useMemo(() => {
        const recs = [];
        const availableSPs = topSalespersons.filter(sp => sp.status === 'Active');

        highValueCustomers.slice(0, Math.min(5, availableSPs.length)).forEach((customer, idx) => {
            if (idx < availableSPs.length) {
                const sp = availableSPs[idx];
                recs.push({
                    customer,
                    salesperson: sp,
                    matchScore: 95 - (idx * 5),
                    reason: `Top ${idx + 1} customer matched with #${idx + 1} rated salesperson`
                });
            }
        });

        return recs;
    }, [highValueCustomers, topSalespersons]);

    const handleAssign = (customerId, salespersonId) => {
        setAssignments(prev => ({
            ...prev,
            [customerId]: salespersonId
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-purple-600" />
                        <h2 className="text-3xl font-bold tracking-tight">AI Hotlead</h2>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Intelligent matching of high-value customers with top-rated salespersons
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">High-Value Customers</p>
                                <p className="text-2xl font-bold">{highValueCustomers.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Award className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Top Salespersons</p>
                                <p className="text-2xl font-bold">{topSalespersons.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Sparkles className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">AI Recommendations</p>
                                <p className="text-2xl font-bold">{recommendations.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Recommendations Section */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <CardTitle>AI-Powered Recommendations</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recommendations.map((rec, idx) => {
                            const isAssigned = assignments[rec.customer.customer?.id] === rec.salesperson.id;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Customer Info */}
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                                                {rec.customer.customer?.photo ? (
                                                    <img src={rec.customer.customer.photo} className="h-full w-full rounded-full object-cover" alt="" />
                                                ) : (
                                                    (rec.customer.customer?.short_id || 'C').substring(0, 2)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">
                                                    Customer {rec.customer.customer?.short_id || rec.customer.customer?.id}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {rec.customer.itemsPurchased} items • ₹{rec.customer.totalValue.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Match Score */}
                                        <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full">
                                            <Sparkles className="h-3 w-3 text-purple-600" />
                                            <span className="text-xs font-bold text-purple-700">{rec.matchScore}% Match</span>
                                        </div>

                                        <ArrowRight className="h-5 w-5 text-gray-400" />

                                        {/* Salesperson Info */}
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-600">
                                                {rec.salesperson.photo ? (
                                                    <img src={rec.salesperson.photo} className="h-full w-full rounded-full object-cover" alt="" />
                                                ) : (
                                                    rec.salesperson.name.substring(0, 2).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{rec.salesperson.name}</p>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs text-muted-foreground">{rec.salesperson.rating} rating</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div>
                                            {isAssigned ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Assigned
                                                </Badge>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAssign(rec.customer.customer?.id, rec.salesperson.id)}
                                                    className="h-8"
                                                >
                                                    Assign
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 ml-13">{rec.reason}</p>
                                </div>
                            );
                        })}
                        {recommendations.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Sparkles className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p>No recommendations available at the moment</p>
                                <p className="text-xs mt-1">High-value customers or top salespersons data needed</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* High-Value Customers */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            <CardTitle>High-Value Customers</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {highValueCustomers.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-bold">
                                        #{idx + 1}
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                                        {stat.customer?.photo ? (
                                            <img src={stat.customer.photo} className="h-full w-full rounded-full object-cover" alt="" />
                                        ) : (
                                            (stat.customer?.short_id || 'C').substring(0, 2)
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">
                                            Customer {stat.customer?.short_id || stat.customer?.id}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <ShoppingBag className="h-3 w-3" />
                                                {stat.itemsPurchased} items
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <IndianRupee className="h-3 w-3" />
                                                {(stat.totalValue / 1000).toFixed(0)}k
                                            </span>
                                        </div>
                                    </div>
                                    {idx < 3 && (
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                            VIP
                                        </Badge>
                                    )}
                                </div>
                            ))}
                            {highValueCustomers.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No high-value customers found
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top-Rated Salespersons */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-green-600" />
                            <CardTitle>Top-Rated Salespersons</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topSalespersons.map((sp, idx) => (
                                <div
                                    key={sp.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-bold">
                                        #{idx + 1}
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-600">
                                        {sp.photo ? (
                                            <img src={sp.photo} className="h-full w-full rounded-full object-cover" alt="" />
                                        ) : (
                                            sp.name.substring(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{sp.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${i < Math.floor(sp.rating)
                                                            ? 'text-yellow-500 fill-yellow-500'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span>₹{(sp.sales / 1000).toFixed(0)}k sales</span>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            sp.status === 'Active'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }
                                    >
                                        {sp.availability}
                                    </Badge>
                                </div>
                            ))}
                            {topSalespersons.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No salespersons found
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
