import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit, Trash, Search, User, ShoppingBag, Eye, MessageSquare, Clock, MapPin, X, ChevronRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { uploadImage } from '../services/api';

const MOCK_FLOATING_CUSTOMERS = [
    { id: 'FC-1001', name: 'Visitor 1001', time: '10:45 AM', zone: 'Entrance' },
    { id: 'FC-1002', name: 'Visitor 1002', time: '11:15 AM', zone: 'Lobby' },
    { id: 'FC-1003', name: 'Visitor 1003', time: '11:40 AM', zone: 'Waiting Area' },
    { id: 'FC-1004', name: 'Visitor 1004', time: '12:20 PM', zone: 'Entrance' },
    { id: 'FC-1005', name: 'Visitor 1005', time: '12:55 PM', zone: 'Lobby' },
];

export default function Salesmen() {
    const { salespersons, addSalesperson, updateSalesperson, deleteSalesperson, customers, sessions } = useData();
    const [activeTab, setActiveTab] = useState('salesperson'); // 'salesperson' or 'floating'

    // Salesperson Tab State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', role: 'salesman', zone: 'First Floor', status: 'Active', password: '', photo: '' });
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Floating Customer Tab State
    const [assignments, setAssignments] = useState({}); // { 'FC-1001': { id: 1, name: 'Vishwa' } }
    const [allocatingCustomer, setAllocatingCustomer] = useState(null); // ID of customer being allocated

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const data = await uploadImage(file);
            setFormData(prev => ({ ...prev, photo: data.url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed!");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateSalesperson(editingId, formData);
        } else {
            addSalesperson({ ...formData, sales: 0 });
        }
        closeForm();
    };

    const openEdit = (person, e) => {
        e.stopPropagation(); // Prevent row click
        setFormData({
            name: person.name,
            role: person.role,
            zone: person.zone || 'First Floor',
            status: person.status,
            password: person.password || '',
            photo: person.photo || ''
        });
        setEditingId(person.id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ name: '', role: 'salesman', zone: 'First Floor', status: 'Active', password: '', photo: '' });
    };

    // Allocate Action
    const handleAllocate = (customer, salesperson) => {
        setAssignments(prev => ({
            ...prev,
            [customer.id]: salesperson
        }));
        setAllocatingCustomer(null);
    };

    const filteredSalespersons = salespersons.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `ID${p.id}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Salesperson & Customer Allocation</h2>
                    <p className="text-muted-foreground mt-1">Manage salespersons and floor assignments</p>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex gap-4 border-b">
                <button
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'salesperson' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('salesperson')}
                >
                    Salesperson Management
                    {activeTab === 'salesperson' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'floating' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('floating')}
                >
                    Floating Customers
                    {activeTab === 'floating' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
            </div>

            {activeTab === 'salesperson' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex justify-end gap-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search Salesperson..."
                                className="h-10 w-[250px] rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setIsFormOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Salesperson</Button>
                    </div>

                    {isFormOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-0">
                                <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
                                    <CardTitle className="text-xl">{editingId ? 'Edit Salesperson' : 'New Salesperson'}</CardTitle>
                                    <Button variant="ghost" size="icon" onClick={closeForm} className="h-8 w-8 rounded-full">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-end">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Name</label>
                                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Role</label>
                                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                                <option value="salesman">Salesman</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                                <option value="CRM">CRM</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Floor</label>
                                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                value={formData.zone} onChange={e => setFormData({ ...formData, zone: e.target.value })}>
                                                <option>First Floor</option>
                                                <option>Second Floor</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Status</label>
                                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                                <option>Active</option>
                                                <option>On Leave</option>
                                                <option>Inactive</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Password</label>
                                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                type="text"
                                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="Set Password" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Profile Image</label>
                                            <div className="flex gap-2 items-center">
                                                <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:bg-transparent file:border-0 file:text-sm file:font-medium"
                                                    type="file" accept="image/*" onChange={handleFileChange} />
                                                {uploading && <span className="text-xs text-muted-foreground">Uploading...</span>}
                                            </div>
                                            {formData.photo && (
                                                <div className="h-10 w-10 rounded-full overflow-hidden border mt-1">
                                                    <img src={formData.photo} alt="Preview" className="h-full w-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 lg:col-span-3 justify-end mt-4">
                                            <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                                            <Button type="submit" disabled={uploading}>Save Changes</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <Card className="overflow-hidden">
                        <div className="rounded-md border bg-white">
                            <Table>
                                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead className="w-[250px]">Salesperson</TableHead>
                                        <TableHead className="w-[280px]">Customer</TableHead>
                                        <TableHead className="min-w-[300px]">Jewels Shown & Sold</TableHead>
                                        <TableHead className="w-[80px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSalespersons.map(person => {
                                        const personSessions = sessions.filter(s => s.salesperson_id === person.id || (s.salesperson && s.salesperson.id === person.id));

                                        if (personSessions.length === 0) {
                                            return (
                                                <TableRow key={`person-${person.id}`} className="hover:bg-muted/30">
                                                    <TableCell className="align-top py-6 border-b">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-500 font-semibold">
                                                                {person.photo ? (
                                                                    <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <span>{(person.name || "S").substring(0, 2).toUpperCase()}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-sm text-gray-900">{person.name}</div>
                                                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                                    <span>ID: {person.id}</span>
                                                                    <span className="text-gray-300">|</span>
                                                                    <span className="flex items-center text-gray-500">
                                                                        <MapPin className="h-3 w-3 mr-0.5" />
                                                                        {person.zone}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell colSpan={3} className="text-center text-muted-foreground text-xs italic align-middle border-b">
                                                        No customer sessions recorded yet.
                                                    </TableCell>
                                                    <TableCell className="text-right align-middle border-b">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 px-3 text-xs font-medium border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                                                                onClick={(e) => openEdit(person, e)}
                                                            >
                                                                <Edit className="h-3.5 w-3.5 mr-1.5" />
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }

                                        // Group sessions by customer
                                        const customerGroups = {};
                                        personSessions.forEach(session => {
                                            const custId = session.customer_id || (session.customer && session.customer.id) || 'unknown';
                                            if (!customerGroups[custId]) {
                                                customerGroups[custId] = {
                                                    customer: session.customer,
                                                    sessions: [],
                                                    allJewels: []
                                                };
                                            }
                                            customerGroups[custId].sessions.push(session);
                                            if (session.details) {
                                                customerGroups[custId].allJewels.push(...session.details);
                                            }
                                        });

                                        const groupedCustomers = Object.values(customerGroups);

                                        return groupedCustomers.map((group, index) => {
                                            const customer = group.customer || { id: "Unknown", short_id: "UNK", last_seen: null, photo: null };
                                            const firstSession = group.sessions[0];
                                            const sessionDateObj = new Date(firstSession.start_time || firstSession.timestamp || Date.now());
                                            const sessionTime = sessionDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            const sessionDate = sessionDateObj.toLocaleDateString('en-GB');

                                            return (
                                                <TableRow key={`${person.id}-${customer.id || index}`} className="hover:bg-gray-50/50 group border-b last:border-0">
                                                    {/* Salesperson Column - Merged with rowSpan */}
                                                    {index === 0 && (
                                                        <TableCell rowSpan={groupedCustomers.length} className="align-top py-4 border-r bg-white/50">
                                                            <div className="flex items-center gap-3 sticky top-16">
                                                                <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0 bg-gray-100 flex items-center justify-center text-gray-500 font-semibold">
                                                                    {person.photo ? (
                                                                        <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
                                                                    ) : (
                                                                        <span>{(person.name || "S").substring(0, 2).toUpperCase()}</span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="font-semibold text-sm text-gray-900">{person.name}</div>
                                                                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                                        <span>ID: {person.id}</span>
                                                                        <span className="text-gray-300">|</span>
                                                                        <span className="flex items-center text-gray-500">
                                                                            <MapPin className="h-3 w-3 mr-0.5" />
                                                                            {person.zone}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    )}

                                                    {/* Customer Column */}
                                                    <TableCell className="align-top py-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 text-xs font-bold text-blue-600 mt-1 shadow-sm shrink-0">
                                                                {customer.photo ? <img src={customer.photo} className="h-full w-full rounded-full object-cover" /> : (customer.short_id || "C").substring(0, 2)}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-sm text-gray-900">Customer ID: {customer.short_id || customer.id}</div>
                                                                <div className="text-xs text-muted-foreground mt-0.5 flex flex-col gap-0.5">
                                                                    <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>{sessionDate}</span>
                                                                        <span className="text-gray-300">•</span>
                                                                        <span>{sessionTime}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Jewels Shown & Sold (Combined) */}
                                                    <TableCell className="align-top py-4 border-b">
                                                        <div className="flex flex-col gap-1.5">
                                                            {group.allJewels.map((detail, idx) => {
                                                                const jewel = detail.jewel || { name: 'Unknown Item', id: 0 };
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
                                                                );
                                                            })}
                                                            {group.allJewels.length === 0 && (
                                                                <span className="text-xs text-gray-300">-</span>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    {/* Actions */}
                                                    <TableCell className="align-top py-4 text-right">
                                                        {index === 0 && (
                                                            <div className="flex justify-end gap-1 opacity-100">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 px-3 text-xs font-medium border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                                                                    onClick={(e) => openEdit(person, e)}
                                                                >
                                                                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                                                                    Edit
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        });
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'floating' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <Card className="border-0 shadow-lg ring-1 ring-black/5">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead>Customer ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Time of Entry</TableHead>
                                    <TableHead>Current Zone</TableHead>
                                    <TableHead>Status / Assignment</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_FLOATING_CUSTOMERS.map((customer) => {
                                    const assignedTo = assignments[customer.id];
                                    return (
                                        <TableRow key={customer.id} className="hover:bg-gray-50/50">
                                            <TableCell className="font-medium text-gray-900">{customer.id}</TableCell>
                                            <TableCell>{customer.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{customer.time}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal text-xs">{customer.zone}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {assignedTo ? (
                                                    <div className="flex items-center gap-2 text-green-600 font-medium text-sm transition-all animate-in zoom-in-50">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Assigned to {assignedTo.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm italic">Unassigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right relative">
                                                {!assignedTo && (
                                                    <Button
                                                        size="sm"
                                                        className="h-8 shadow-sm"
                                                        onClick={() => setAllocatingCustomer(allocatingCustomer === customer.id ? null : customer.id)}
                                                    >
                                                        <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                                        Allocate
                                                    </Button>
                                                )}

                                                {/* Assignment Popover */}
                                                {allocatingCustomer === customer.id && (
                                                    <div className="absolute right-0 top-10 z-50 w-64 bg-white rounded-lg shadow-xl ring-1 ring-black/5 p-2 animate-in fade-in zoom-in-95 origin-top-right">
                                                        <div className="text-xs font-semibold text-gray-500 px-2 py-1.5 mb-1 border-b">
                                                            Select Salesperson
                                                        </div>
                                                        <div className="max-h-48 overflow-y-auto space-y-1">
                                                            {salespersons.map(sp => (
                                                                <button
                                                                    key={sp.id}
                                                                    className="w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded text-sm flex items-center gap-2"
                                                                    onClick={() => handleAllocate(customer, sp)}
                                                                >
                                                                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                                        {(sp.name || "S").charAt(0)}
                                                                    </div>
                                                                    <div className="truncate">{sp.name}</div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Backdrop to close popover */}
                                                {allocatingCustomer === customer.id && (
                                                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setAllocatingCustomer(null)} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            )}
        </div>
    );
}
