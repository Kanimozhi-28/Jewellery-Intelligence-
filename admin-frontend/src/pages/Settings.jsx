import React from 'react';
import { useData } from '../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';

export default function Settings() {
    const { auditLogs } = useData();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Store Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Store Name</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="LuxeGem Main Branch" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Number of Floors</label>
                            <input type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="2" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Active Zones</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="Zone A, Zone B, Entrance, VIP Lounge" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Camera Ip Range</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="192.168.1.100 - 192.168.1.120" />
                        </div>
                        <Button>Save Configuration</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Audit Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-xs text-muted-foreground">{log.time}</TableCell>
                                        <TableCell>{log.user}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
