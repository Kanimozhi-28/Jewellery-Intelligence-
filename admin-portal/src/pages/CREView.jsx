import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UserPlus, UserMinus, Clock, MapPin, RefreshCcw } from 'lucide-react';
import { fetchFloatingCustomers, markCustomerIgnored, allocateCustomer, fetchSalespersons } from '../services/api';

export default function CREView() {
    const [floatingCustomers, setFloatingCustomers] = useState([]);
    const [salespersons, setSalespersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allocating, setAllocating] = useState(null); // ID of customer being allocated
    const [selectedSalesperson, setSelectedSalesperson] = useState('');

    const loadData = async () => {
        try {
            const [customersData, usersData] = await Promise.all([
                fetchFloatingCustomers(),
                fetchSalespersons()
            ]);
            setFloatingCustomers(customersData);
            setSalespersons(usersData.filter(u => u.role === 'salesman'));
        } catch (error) {
            console.error("Failed to load CRE data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // Poll every 10 seconds for real-time updates
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleIgnore = async (id) => {
        if (window.confirm("Mark this individual as a non-customer? They will be removed from tracking.")) {
            try {
                await markCustomerIgnored(id);
                setFloatingCustomers(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                alert("Failed to ignore customer");
            }
        }
    };

    const handleAllocate = async (customerId) => {
        if (!selectedSalesperson) return;

        try {
            await allocateCustomer({
                customer_id: customerId,
                salesperson_id: parseInt(selectedSalesperson),
                start_time: new Date().toISOString(),
                status: 'Active'
            });
            setFloatingCustomers(prev => prev.filter(c => c.id !== customerId));
            setAllocating(null);
            setSelectedSalesperson('');
            alert("Customer allocated successfully!");
        } catch (error) {
            alert("Failed to allocate customer");
        }
    };

    if (loading && floatingCustomers.length === 0) {
        return <div className="p-8 text-center">Loading unassigned customers...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">CRE Dashboard</h2>
                    <p className="text-muted-foreground text-sm">Monitor and assign floating customers in real-time.</p>
                </div>
                <Button variant="outline" size="sm" onClick={loadData} className="gap-2">
                    <RefreshCcw className="h-4 w-4" /> Refresh
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {floatingCustomers.length === 0 ? (
                    <Card className="col-span-full py-12">
                        <CardContent className="flex flex-col items-center justify-center text-muted-foreground">
                            <Clock className="h-12 w-12 mb-4 opacity-20" />
                            <p>No unassigned customers in store right now.</p>
                        </CardContent>
                    </Card>
                ) : (
                    floatingCustomers.map(customer => (
                        <Card key={customer.id} className="overflow-hidden border-l-4 border-l-amber-500">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-100 flex-shrink-0">
                                    {customer.photo ? (
                                        <img src={customer.photo} alt="Customer" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                                            <MapPin className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-bold">#{customer.short_id}</CardTitle>
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                            Floating
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <Clock className="h-3 w-3" /> Seen {new Date(customer.first_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {customer.current_floor || "Ground Floor"}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                {allocating === customer.id ? (
                                    <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">Assign to Salesman</label>
                                        <select
                                            className="w-full text-sm p-2 rounded-md border border-input bg-white"
                                            value={selectedSalesperson}
                                            onChange={(e) => setSelectedSalesperson(e.target.value)}
                                        >
                                            <option value="">Select Agent...</option>
                                            {salespersons.map(sp => (
                                                <option key={sp.id} value={sp.id}>{sp.full_name || sp.username}</option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2 pt-1">
                                            <Button size="sm" className="flex-1 text-xs" onClick={() => handleAllocate(customer.id)}>Confirm</Button>
                                            <Button size="sm" variant="ghost" className="text-xs" onClick={() => setAllocating(null)}>Cancel</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <Button
                                            variant="outline"
                                            className="gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                                            size="sm"
                                            onClick={() => setAllocating(customer.id)}
                                        >
                                            <UserPlus className="h-3 w-3" /> Allocate
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="gap-2 border-red-200 hover:bg-red-50 text-red-600"
                                            size="sm"
                                            onClick={() => handleIgnore(customer.id)}
                                        >
                                            <UserMinus className="h-3 w-3" /> Ignore
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
