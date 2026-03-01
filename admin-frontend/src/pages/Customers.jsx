import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Eye, X, Filter, Users, Diamond, ShoppingBag, Clock, UserCheck, MessageSquare, MapPin, Edit, Trash, Search, ChevronRight } from 'lucide-react';
import { groupSessionsByCustomer } from '../utils/sessionHelpers';

const MOCK_NAMES = [
    "Vikram Singh", "Rahul Gupta", "Suresh Kumar", "Rohan Verma", "Amit Joshi",
    "Deepak Chopra", "Arjun Nair", "Karan Johar", "Aditya Roy", "Manish Malhotra",
    "Varun Dhawan", "Sidharth Malhotra", "Ranbir Kapoor", "Ranveer Singh", "Shahid Kapoor"
];

const MOCK_TIMES = [
    "10:30 AM", "11:15 AM", "12:45 PM", "02:20 PM", "03:45 PM", "04:10 PM", "05:55 PM", "06:30 PM"
];

export default function Customers() {
    const { customers, familyClusters, salespersons, jewellery, sessions } = useData();
    const [filterFloor, setFilterFloor] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [selectedFrequencies, setSelectedFrequencies] = useState([]);

    // Modal State
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);


    // Create a lookup for customer families
    const customerFamilyMap = {};
    const familyDetailsMap = {}; // store full family object by name/ID logic

    if (familyClusters) {
        familyClusters.forEach(family => {
            // Map members to family name
            if (family.members) {
                family.members.forEach(member => {
                    const idKey = member.short_id || member.id;
                    if (idKey) customerFamilyMap[idKey] = family.name;
                });
            }
            // Map family name to family object for easy retrieval
            familyDetailsMap[family.name] = family;
        });
    }

    const toggleFrequency = (freq) => {
        setSelectedFrequencies(prev => prev.includes(freq) ? prev.filter(f => f !== freq) : [...prev, freq]);
    };

    const filteredCustomers = customers.filter(customer => {
        const cId = customer.short_id || customer.id;

        // 1. Search Filter
        if (searchId && !String(cId).toLowerCase().includes(searchId.toLowerCase())) return false;

        // 2. Frequency Filter
        if (selectedFrequencies.length > 0) {
            const visits = customer.visits || 1;
            let match = false;
            if (selectedFrequencies.includes('New') && visits === 1) match = true;
            if (selectedFrequencies.includes('Regular') && visits >= 2 && visits <= 5) match = true;
            if (selectedFrequencies.includes('VIP') && visits > 5) match = true;
            if (!match) return false;
        }

        // 3. Family Logic: Hide members who are NOT family heads
        // A customer is a "member" if they are in a family AND their ID != Family Name
        const familyName = customerFamilyMap[cId];
        if (familyName) {
            // If family name EXACTLY matches ID, they are Head -> SHOW
            // If mismatch, they are member -> HIDE
            // Note: Assuming strict string equality.
            if (String(cId) !== String(familyName)) {
                return false;
            }
        }

        return true;
    });

    const handleCustomerClick = (customer) => {
        const cId = customer.short_id || customer.id;
        const familyName = customerFamilyMap[cId];

        if (familyName && String(cId) === String(familyName)) {
            // It's a family head, open modal
            const familyData = familyDetailsMap[familyName];
            if (familyData) {
                setSelectedFamily(familyData);
                setIsFamilyModalOpen(true);
            }
        }
    };

    // Helper to get sessions/jewels for a specific member ID
    const getMemberDetails = (memberId) => {
        const memberSessions = sessions.filter(s =>
            s.customer_id == memberId || // loose compare in case of int/string string
            (s.customer && s.customer.id == memberId) ||
            (s.customer && s.customer.short_id == memberId)
        );

        const jewels = [];
        memberSessions.forEach(s => {
            if (s.details) jewels.push(...s.details);
        });
        return { sessions: memberSessions, jewels };
    };


    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                <div className="flex gap-2 w-64">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search Customer ID..."
                            className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-black/5 rounded-xl bg-white">
                <div className="">
                    <Table>
                        <TableHeader className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm border-b">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[300px] py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 pl-6">Customer</TableHead>
                                <TableHead className="w-[280px] py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Salesperson</TableHead>
                                <TableHead className="min-w-[320px] py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Jewels Shown & Sold</TableHead>
                                <TableHead className="w-[280px] py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 pr-6">Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.map((customer, index) => {
                                const customerSessions = sessions.filter(s => s.customer_id === customer.id || (s.customer && s.customer.id === customer.id));
                                const cId = customer.short_id || customer.id;
                                const isFamilyHead = customerFamilyMap[cId] && String(cId) === String(customerFamilyMap[cId]);

                                if (customerSessions.length === 0 && !isFamilyHead) { // Still show head even if no sessions? Yes usually.
                                    return (
                                        <TableRow
                                            key={customer.id}
                                            className={`hover:bg-gray-50/50 transition-colors ${isFamilyHead ? 'cursor-pointer hover:bg-blue-50/30' : ''}`}
                                            onClick={() => isFamilyHead && handleCustomerClick(customer)}
                                        >
                                            <TableCell className="align-top py-6 pl-6 border-b border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-sm font-bold text-slate-500 shadow-sm shrink-0">
                                                        {customer.photo ? <img src={customer.photo} className="h-full w-full rounded-full object-cover" /> : (customer.name || "C").split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-gray-900 truncate flex items-center gap-2">
                                                            Customer ID: {cId || "Unknown"}
                                                            {isFamilyHead && <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] px-1 py-0 h-5">Family Head</Badge>}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                                            <Clock className="h-3 w-3 text-gray-400" />
                                                            <span>{new Date(customer.last_seen || Date.now()).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}</span>
                                                            <span className="text-gray-300">•</span>
                                                            <span>{new Date(customer.last_seen || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell colSpan={3} className="text-center text-gray-400 text-sm italic align-middle border-b border-gray-100 py-6">
                                                No recent activity recorded
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                                // Combine all session data for this customer into one row
                                const firstSession = customerSessions[0] || {};
                                const allJewels = [];
                                const salespersons = new Set();

                                customerSessions.forEach(session => {
                                    if (session.details) {
                                        allJewels.push(...session.details);
                                    }
                                    if (session.salesperson) {
                                        salespersons.add(JSON.stringify(session.salesperson));
                                    }
                                });

                                const uniqueSalespersons = Array.from(salespersons).map(sp => JSON.parse(sp));

                                return (
                                    <TableRow
                                        key={customer.id}
                                        className={`group hover:bg-gray-50/30 transition-all border-b border-gray-100 last:border-0 ${isFamilyHead ? 'cursor-pointer hover:bg-blue-50/30' : ''}`}
                                        onClick={() => isFamilyHead && handleCustomerClick(customer)}
                                    >
                                        <TableCell className="align-top py-6 pl-6 border-r border-gray-100 bg-white/50 w-[300px]">
                                            <div className="sticky top-20 flex items-start gap-4">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100 text-sm font-bold text-blue-600 shadow-sm shrink-0 ring-2 ring-white">
                                                    {customer.photo ? <img src={customer.photo} className="h-full w-full rounded-full object-cover" /> : (customer.name || "C").trim().split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-sm text-gray-900 truncate flex items-center gap-2">
                                                        Customer ID: {cId || "Unknown"}
                                                        {isFamilyHead && <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] px-1 py-0 h-5">Family Head</Badge>}
                                                    </div>

                                                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                                        <Clock className="h-3 w-3 text-gray-400" />
                                                        <span>{new Date(firstSession.start_time || Date.now()).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span>{new Date(firstSession.start_time || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })}</span>
                                                    </div>
                                                    {isFamilyHead && (
                                                        <div className="text-xs font-semibold text-indigo-600 mt-1 flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            With Family ({familyDetailsMap[customerFamilyMap[cId]]?.members?.length || 0} Members)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-top py-6 border-b border-gray-100 w-[280px]">
                                            {uniqueSalespersons.map((salesperson, spIdx) => (
                                                <div key={spIdx} className="flex items-center gap-3 mb-2 last:mb-0">
                                                    <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-white flex items-center justify-center">
                                                        {salesperson && (salesperson.photo_url || salesperson.photo) ? (
                                                            <img
                                                                src={salesperson.photo_url || salesperson.photo}
                                                                alt={salesperson.full_name || salesperson.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-blue-600">
                                                                {salesperson ? (salesperson.full_name || salesperson.name || "SP").split(' ').map(n => n[0]).join('').toUpperCase() : "SP"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-gray-900">{salesperson ? (salesperson.full_name || salesperson.name) : "Unknown Salesperson"}</div>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                                                            <span className="shrink-0">ID: {salesperson ? salesperson.id : "N/A"}</span>
                                                            <span className="text-gray-300 shrink-0">|</span>
                                                            <span className="flex items-center text-gray-500 shrink-0">
                                                                <MapPin className="h-3 w-3 mr-0.5" />
                                                                {salesperson ? salesperson.zone : "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </TableCell>

                                        <TableCell className="align-top py-6 border-b border-gray-100">
                                            <div className="flex flex-col gap-1.5">
                                                {allJewels.map((detail, idx) => {
                                                    const jewel = detail.jewel || { name: "Unknown Item", id: 0, barcode: "N/A" };
                                                    const isSold = detail.action === "Sold" || detail.action === "Purchased";
                                                    return (
                                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                            {isSold ? (
                                                                <ShoppingBag className="h-4 w-4 text-green-600 shrink-0" />
                                                            ) : (
                                                                <div className="h-1.5 w-1.5 rounded-full bg-gray-300 ml-1.5 mr-1" />
                                                            )}
                                                            <span className={isSold ? "font-medium text-gray-900" : ""}>{jewel.name || jewel.barcode}</span>
                                                            {isSold && (
                                                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-1">SOLD</span>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                                {allJewels.length === 0 && (
                                                    <span className="text-gray-300 font-light text-2xl px-2 leading-none self-center">-</span>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-top py-6 pr-6 border-b border-gray-100 w-[280px]">
                                            {(() => {
                                                const detailComments = allJewels
                                                    .filter(d => d.comments && d.comments.trim())
                                                    .map(d => d.comments);

                                                return detailComments.length > 0 ? (
                                                    <div className="flex flex-col gap-2">
                                                        {detailComments.map((comment, idx) => (
                                                            <div key={idx} className="relative pl-3 text-sm text-gray-600 italic">
                                                                <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-gray-200 rounded-full"></div>
                                                                "{comment}"
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300 font-light text-2xl leading-none">-</span>
                                                );
                                            })()}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* FAMILY DETAILS MODAL */}
            {isFamilyModalOpen && selectedFamily && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFamilyModalOpen(false)} />
                    <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Family Details</h3>
                                <p className="text-gray-500 text-sm mt-1">Head Account: {selectedFamily.name}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsFamilyModalOpen(false)}><X className="h-5 w-5" /></Button>
                        </div>

                        <div className="overflow-y-auto p-6 bg-gray-50/30">
                            <div className="grid grid-cols-1 gap-6">
                                {selectedFamily.members && selectedFamily.members.map((member, idx) => {
                                    const { sessions: memberSessions, jewels: memberJewels } = getMemberDetails(member.id);
                                    const isHead = String(member.short_id || member.id) === String(selectedFamily.name);

                                    return (
                                        <div key={member.id} className={`bg-white rounded-lg border ${isHead ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-gray-200'} shadow-sm p-4 flex gap-6`}>
                                            {/* Left: Photo & Info */}
                                            <div className="shrink-0 flex flex-col items-center gap-3 w-40 border-r pr-6 border-gray-100">
                                                <div className="h-20 w-20 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                                                    {member.customer_jpg ? (
                                                        <img src={member.customer_jpg} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-xl">
                                                            {(member.name || "M").charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-gray-900 text-sm break-all">{member.short_id || member.id}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{member.family_relationship || "Member"}</div>
                                                    {isHead && <span className="inline-block mt-2 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">HEAD</span>}
                                                </div>
                                            </div>

                                            {/* Right: Activity & Jewels */}
                                            <div className="grow space-y-3">
                                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <ShoppingBag className="h-4 w-4" />
                                                    Jewels Shown / Activity
                                                </h4>

                                                {memberJewels.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {memberJewels.map((detail, jIdx) => (
                                                            <div key={jIdx} className="text-sm bg-gray-50 p-2 rounded border border-gray-100 flex items-center gap-2">
                                                                <div className={`h-2 w-2 rounded-full ${detail.action === 'Sold' ? 'bg-green-500' : 'bg-blue-400'}`} />
                                                                <span className="font-medium">{detail.jewel?.name || detail.jewel?.barcode || "Unknown Jewel"}</span>
                                                                {detail.comments && (
                                                                    <span className="text-gray-400 text-xs italic ml-auto truncate max-w-[120px]">"{detail.comments}"</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-400 italic py-2">No jewels recorded for this member.</p>
                                                )}

                                                {/* Session Info (Optional) */}
                                                <div className="text-xs text-gray-400 mt-2 flex gap-4 border-t pt-2 max-w-md">
                                                    <span>Total Visits: {member.total_visits || member.visits || 0}</span>
                                                    <span>Last Seen: {member.last_seen ? new Date(member.last_seen).toLocaleDateString() : 'Never'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t text-right">
                            <Button onClick={() => setIsFamilyModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
                    <div className="relative w-80 bg-background h-full shadow-xl border-l p-6 animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}><X className="h-4 w-4" /></Button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search Customer ID</label>
                                <input type="text" placeholder="e.g. CUST-001" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Visit Frequency</label>
                                <div className="space-y-2">
                                    {['New', 'Regular', 'VIP'].map(f => (
                                        <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="rounded border-gray-300" checked={selectedFrequencies.includes(f)} onChange={() => toggleFrequency(f)} /> {f}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <Button variant="outline" className="w-full mt-4" onClick={() => { setSearchId(''); setSelectedFrequencies([]); }}>Reset Filters</Button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
