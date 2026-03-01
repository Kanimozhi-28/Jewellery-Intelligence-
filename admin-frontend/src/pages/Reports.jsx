import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';
import { Download, FileText, Eye, X, Printer } from 'lucide-react';

export default function Reports() {
    const { salespersons, customers } = useData();
    const [editingReport, setEditingReport] = useState(null);

    // Mock Data Generators (consistent with Salesmen.jsx)
    const getJewelsShown = (id) => (id * 12) + 5;
    const getJewelsSold = (id) => (id * 2) + 1;
    const getCustomersAttendedCount = (id) => (id % 5) + 2; // Deterministic mock matching Salesmen.jsx

    // --- Mock Interaction Helpers ---
    const getAttendedCustomers = (salespersonId) => {
        if (!customers || customers.length === 0) return [];
        return customers.slice(0, (salespersonId % 5) + 2); // Return 2-6 customers
    };

    const getSessionDetails = (salespersonId, customerId) => {
        // Varied data based on salesperson ID and Customer ID
        const seed = salespersonId + customerId;
        const isEven = seed % 2 === 0;

        if (isEven) {
            return {
                jewelsShown: [
                    { id: 201, name: "Gold Bangles Set" },
                    { id: 202, name: "Antique Jhumkas" }
                ],
                jewelsSold: [],
                comments: "Looking for traditional wear. Liked the intricate work but wanted to check other options."
            };
        } else {
            return {
                jewelsShown: [
                    { id: 301, name: "Solitaire Pendant" },
                    { id: 302, name: "Diamond Studs" },
                    { id: 303, name: "Tennis Bracelet" }
                ],
                jewelsSold: [
                    { id: 303, name: "Tennis Bracelet" }
                ],
                comments: "Browsing for daily wear diamonds. Preferred minimal designs. Bought the bracelet."
            };
        }
    };

    // --- Export Functions ---

    const exportToCSV = (person = null) => {
        const dataToExport = person ? [person] : salespersons;
        const headers = ["ID", "Name", "Role", "Zone", "Customers Attended", "Jewels Shown", "Jewels Sold", "Sales", "Status"];
        const rows = dataToExport.map(p => [
            `ID${p.id.toString().padStart(3, '0')}`,
            p.name,
            p.role,
            p.zone,
            getCustomersAttendedCount(p.id),
            getJewelsShown(p.id),
            getJewelsSold(p.id),
            p.sales,
            p.status
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${person ? person.name : 'Salesperson_Report'}_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = (person = null) => {
        const dataToExport = person ? [person] : salespersons;
        const fileName = `${person ? person.name : 'Salesperson_Report'}_${new Date().toLocaleDateString()}.xls`;
        const headers = ["ID", "Name", "Role", "Zone", "Customers Attended", "Jewels Shown", "Jewels Sold", "Sales", "Status"];

        let xml = '<?xml version="1.0"?><ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
        xml += '<ss:Worksheet ss:Name="Salespeople"><ss:Table>';

        // Headers
        xml += '<ss:Row>';
        headers.forEach(h => xml += `<ss:Cell><ss:Data ss:Type="String">${h}</ss:Data></ss:Cell>`);
        xml += '</ss:Row>';

        // Data
        dataToExport.forEach(p => {
            xml += '<ss:Row>';
            xml += `<ss:Cell><ss:Data ss:Type="String">ID${p.id.toString().padStart(3, '0')}</ss:Data></ss:Cell>`;
            xml += `<ss:Cell><ss:Data ss:Type="String">${p.name}</ss:Data></ss:Cell>`;
            xml += `<ss:Cell><ss:Data ss:Type="String">${p.role}</ss:Data></ss:Cell>`;
            xml += `<ss:Cell><ss:Data ss:Type="String">${p.zone}</ss:Data></ss:Cell>`;
            xml += `<ss:Cell><ss:Data ss:Type="Number">${getCustomersAttendedCount(p.id)}</ss:Data></ss:Cell>`;
            xml += `<ss:Cell><ss:Data ss:Type="Number">${getJewelsShown(p.id)}</ss:Data></ss:Cell>`;
            xml += `<ss:Cell><ss:Data ss:Type="Number">${getJewelsSold(p.id)}</ss:Data></ss:Cell>`;
            xml += `<ss:Cell><ss:Data ss:Type="Number">${p.sales}</ss:Data></ss:Cell>`;
            xml += `<ss:Cell><ss:Data ss:Type="String">${p.status}</ss:Data></ss:Cell>`;
            xml += '</ss:Row>';
        });

        xml += '</ss:Table></ss:Worksheet></ss:Workbook>';

        const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const generatePDF = (data, isFullTeam = false) => {
        const printWindow = window.open('', '_blank');
        const date = new Date().toLocaleDateString();

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>DataGold - ${isFullTeam ? 'Team' : 'Executive'} Report</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                    body { font-family: 'Inter', sans-serif; color: #1a1a1a; padding: 30px; line-height: 1.4; font-size: 13px; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 30px; }
                    .logo-section h1 { font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
                    .logo-section p { font-size: 11px; color: #666; margin: 2px 0 0; text-transform: uppercase; letter-spacing: 1px; }
                    .meta-section { text-align: right; }
                    .meta-section p { margin: 0; font-size: 11px; color: #444; }
                    .section-title { font-size: 14px; font-weight: 700; border-left: 3px solid #000; padding-left: 10px; margin: 30px 0 15px; text-transform: uppercase; letter-spacing: 0.5px; }
                    
                    /* Profile Layout */
                    .profile-card { display: flex; align-items: center; gap: 20px; background: #fafafa; border: 1px solid #eee; padding: 15px 20px; border-radius: 8px; margin-bottom: 10px; }
                    .profile-img { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                    .profile-info h2 { font-size: 18px; margin: 0; color: #000; }
                    .profile-info p { margin: 2px 0; color: #666; font-size: 13px; }
                    .status-badge { display: inline-block; padding: 2px 10px; border-radius: 15px; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-top: 5px; }
                    .status-active { background: #dcfce7; color: #166534; }
                    .status-other { background: #fef3c7; color: #92400e; }

                    /* Table Styles */
                    table { width: 100%; border-collapse: collapse; margin-top: 5px; }
                    th { text-align: left; padding: 10px; background: #1a1a1a; color: #fff; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
                    td { padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; }
                    tr:last-child td { border-bottom: none; }
                    .metric-name { font-weight: 600; color: #000; }
                    .text-right { text-align: right; }
                    .highlight-cell { background: #f9f9f9; font-weight: 700; color: #000; }
                    
                    .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 15px; font-size: 10px; color: #999; text-align: center; }
                    @media print { 
                        body { padding: 20px; } 
                        .page-break { page-break-after: always; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo-section">
                        <h1>DataGold</h1>
                        <p>Executive Intelligence Report</p>
                    </div>
                    <div class="meta-section">
                        <p><strong>DATE:</strong> ${date}</p>
                    </div>
                </div>

                ${isFullTeam ? `
                    <div class="section-title">Team Performance Overview</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Sales Representative</th>
                                <th>Department & Zone</th>
                                <th>Status</th>
                                <th class="text-right">Clients</th>
                                <th class="text-right">Jewels Shown</th>
                                <th class="text-right">Jewels Sold</th>
                                <th class="text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${salespersons.map(p => `
                                <tr>
                                    <td>
                                        <div class="metric-name">${p.name}</div>
                                    </td>
                                    <td>${p.role} / ${p.zone}</td>
                                    <td><span class="status-badge ${p.status === 'Active' ? 'status-active' : 'status-other'}">${p.status}</span></td>
                                    <td class="text-right">${getCustomersAttendedCount(p.id)}</td>
                                    <td class="text-right">${getJewelsShown(p.id)}</td>
                                    <td class="text-right">${getJewelsSold(p.id)}</td>
                                    <td class="text-right highlight-cell">₹${Number(p.sales).toLocaleString('en-IN')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="section-title">Consultant Profile</div>
                    <div class="profile-card">
                        ${data.photo ?
                `<img src="${data.photo}" class="profile-img">` :
                `<div class="profile-img" style="background:#f3f4f6; display:flex; align-items:center; justify-content:center; color:#6b7280; font-weight:bold; font-size:24px;">${data.name?.charAt(0)}</div>`
            }
                        <div class="profile-info">
                            <h2>${data.name}</h2>
                            <p>${data.role} | ${data.zone}</p>
                            <span class="status-badge ${data.status === 'Active' ? 'status-active' : 'status-other'}">${data.status}</span>
                        </div>
                    </div>

                    <div class="section-title">Performance Highlights</div>
                    <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                        <div style="flex: 1; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 11px; color: #166534; text-transform: uppercase; font-weight: 600;">Customers Attended</div>
                            <div style="font-size: 24px; font-weight: 800; color: #14532d; margin-top: 5px;">${getCustomersAttendedCount(data.id)}</div>
                        </div>
                        <div style="flex: 1; background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 11px; color: #1e40af; text-transform: uppercase; font-weight: 600;">Jewels Shown</div>
                            <div style="font-size: 24px; font-weight: 800; color: #1e3a8a; margin-top: 5px;">${getJewelsShown(data.id)}</div>
                        </div>
                        <div style="flex: 1; background: #fff7ed; border: 1px solid #fed7aa; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 11px; color: #9a3412; text-transform: uppercase; font-weight: 600;">Jewels Sold</div>
                            <div style="font-size: 24px; font-weight: 800; color: #7c2d12; margin-top: 5px;">${getJewelsSold(data.id)}</div>
                        </div>
                    </div>

                    <div class="section-title">Detailed Performance Analysis</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Performance Indicator</th>
                                <th>Actual Value</th>
                                <th>Target</th>
                                <th class="text-right">Evaluation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="metric-name">Total Revenue Contribution</td>
                                <td class="highlight-cell">₹${Number(data.sales).toLocaleString('en-IN')}</td>
                                <td>₹1,00,00,000</td>
                                <td class="text-right" style="color: ${data.sales >= 100000 ? '#166534' : '#92400e'}; font-weight: 700;">
                                    ${data.sales >= 100000 ? 'OUTSTANDING' : 'STABILIZING'}
                                </td>
                            </tr>
                            <tr>
                                <td class="metric-name">Customers Attended</td>
                                <td>${getCustomersAttendedCount(data.id)}</td>
                                <td>75 Records</td>
                                <td class="text-right" style="color: ${getCustomersAttendedCount(data.id) >= 75 ? '#166534' : '#92400e'}; font-weight: 700;">
                                    ${getCustomersAttendedCount(data.id) >= 75 ? 'HIGH VOLUME' : 'STANDARD'}
                                </td>
                            </tr>
                            <tr>
                                <td class="metric-name">Jewels Shown</td>
                                <td>${getJewelsShown(data.id)}</td>
                                <td>100 Units</td>
                                <td class="text-right">TRACKING</td>
                            </tr>
                             <tr>
                                <td class="metric-name">Jewels Sold</td>
                                <td>${getJewelsSold(data.id)}</td>
                                <td>20 Units</td>
                                <td class="text-right" style="color: ${getJewelsSold(data.id) >= 20 ? '#166534' : '#92400e'}; font-weight: 700;">
                                    ${getJewelsSold(data.id) >= 20 ? 'ON TARGET' : 'BELOW TARGET'}
                                </td>
                            </tr>
                            <tr>
                                <td class="metric-name">Assigned Sales Floor</td>
                                <td>${data.zone}</td>
                                <td>Fixed</td>
                                <td class="text-right">CONSISTENT</td>
                            </tr>
                            <tr>
                                <td class="metric-name">Target Achievement %</td>
                                <td>${((data.sales / 100000) * 100).toFixed(1)}%</td>
                                <td>100.0%</td>
                                <td class="text-right" style="color: ${data.sales >= 100000 ? '#166534' : '#92400e'}; font-weight: 700;">
                                    ${data.sales >= 100000 ? 'ACHIEVED' : 'IN-PROGRESS'}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="section-title">Customer Interaction Logs</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Jewels Shown</th>
                                <th>Jewels Sold</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${getAttendedCustomers(data.id).map(customer => {
                const details = getSessionDetails(data.id, customer.id);
                return `
                                    <tr>
                                        <td>
                                            <div class="metric-name">Customer ${customer.short_id || customer.id}</div>
                                            <div style="font-size: 10px; color: #666;">Last Seen: ${new Date().toLocaleDateString()}</div>
                                        </td>
                                        <td>
                                            ${details.jewelsShown.map(j => `<div style="font-size: 11px;">• ${j.name} <span style="color: #666; font-size: 9px;">(#${j.id})</span></div>`).join('')}
                                        </td>
                                        <td>
                                            ${details.jewelsSold.length > 0
                        ? details.jewelsSold.map(j => `<div style="font-size: 11px; font-weight: bold; color: #166534;">✓ ${j.name}</div>`).join('')
                        : '<span style="color: #999;">-</span>'
                    }
                                        </td>
                                        <td style="font-style: italic; color: #444;">"${details.comments}"</td>
                                    </tr>
                                `;
            }).join('')}
                        </tbody>
                    </table>

                    <div style="margin-top: 30px; padding: 15px; border: 1px dashed #ddd; border-radius: 6px; background: #fafafa;">
                        <h4 style="margin: 0 0 5px; font-size: 11px; text-transform: uppercase; color: #666;">Managerial Notes</h4>
                        <div style="font-size: 12px; color: #333; white-space: pre-wrap;">${data.managerialNotes || 'No notes provided.'}</div>
                    </div>
                `}

                <div class="footer">
                    <p>Generated by DataGold Analytics Engine. This document is a Class A Asset. Unauthorized duplication is strictly prohibited.</p>
                </div>
                <script>window.onload = function() { setTimeout(() => { window.print(); }, 500); }</script>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Salesperson Reports</h2>
                <div className="flex gap-2">
                    <Button className="gap-2" onClick={() => generatePDF(null, true)}>
                        <Printer className="h-4 w-4" /> Team PDF
                    </Button>
                </div>
            </div>

            <Card>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Profile</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Sales</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salespersons.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell className="font-mono text-xs">ID{person.id.toString().padStart(3, '0')}</TableCell>
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                                            {person.photo ? (
                                                <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-bold text-gray-500">{person.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{person.name}</TableCell>
                                    <TableCell>{person.role}</TableCell>
                                    <TableCell>₹{person.sales.toLocaleString('en-IN')}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setEditingReport({ ...person })}>
                                                <Eye className="mr-2 h-4 w-4" /> View
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => generatePDF(person)}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Report Editor Modal */}
            {editingReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5" /> Report Editor
                            </h3>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => generatePDF(editingReport)}>
                                    <Download className="mr-2 h-4 w-4" /> PDF
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => exportToCSV(editingReport)}>
                                    <FileText className="mr-2 h-4 w-4" /> CSV
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => exportToExcel(editingReport)}>
                                    <Printer className="mr-2 h-4 w-4" /> Excel
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setEditingReport(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
                            <div className="bg-white shadow-lg p-10 max-w-3xl mx-auto min-h-[800px] text-gray-800 font-inter">
                                {/* Header */}
                                <div className="flex justify-between border-b-2 border-black pb-4 mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold text-black m-0">DataGold Executive Report</h1>
                                        <p className="text-sm text-gray-500 mt-1">Generated on: {new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">Status: Confidential</p>
                                        <p className="text-sm">Prepared For: {editingReport.name}</p>
                                    </div>
                                </div>

                                {/* Profile Section */}
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                                        {editingReport.photo ? (
                                            <img src={editingReport.photo} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl font-bold text-gray-400">{editingReport.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            className="text-2xl font-bold block w-full border-none focus:ring-0 p-0 hover:bg-gray-50 rounded"
                                            value={editingReport.name}
                                            onChange={(e) => setEditingReport({ ...editingReport, name: e.target.value })}
                                        />
                                        <div className="flex gap-2 mt-1">
                                            <input
                                                className="text-gray-600 text-sm w-32 border-b border-gray-300 focus:border-black p-0 bg-transparent"
                                                value={editingReport.role}
                                                onChange={(e) => setEditingReport({ ...editingReport, role: e.target.value })}
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                className="text-gray-600 text-sm w-24 border-b border-gray-300 focus:border-black p-0 bg-transparent"
                                                value={editingReport.zone}
                                                onChange={(e) => setEditingReport({ ...editingReport, zone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* --- Performance Highlights (View Mode) --- */}
                                <h2 className="text-lg font-bold mb-4">Performance Highlights</h2>
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                                        <div className="text-xs text-green-800 font-semibold uppercase">Customers Attended</div>
                                        <div className="text-2xl font-extrabold text-green-900 mt-2">{getCustomersAttendedCount(editingReport.id)}</div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                                        <div className="text-xs text-blue-800 font-semibold uppercase">Jewels Shown</div>
                                        <div className="text-2xl font-extrabold text-blue-900 mt-2">{getJewelsShown(editingReport.id)}</div>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center">
                                        <div className="text-xs text-orange-800 font-semibold uppercase">Jewels Sold</div>
                                        <div className="text-2xl font-extrabold text-orange-900 mt-2">{getJewelsSold(editingReport.id)}</div>
                                    </div>
                                </div>


                                {/* Metrics */}
                                <h2 className="text-lg font-bold mb-4">Key Performance Metrics</h2>
                                <div className="grid grid-cols-2 gap-5 mb-8">
                                    <div className="border border-gray-200 p-5 rounded-lg bg-gray-50">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Sales</div>
                                        <div className="flex items-baseline text-2xl font-bold text-black">
                                            ₹
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-none focus:ring-0 p-0 font-bold"
                                                value={editingReport.sales}
                                                onChange={(e) => setEditingReport({ ...editingReport, sales: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>
                                    <div className="border border-gray-200 p-5 rounded-lg bg-gray-50">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                                        <select
                                            className="w-full bg-transparent text-xl font-bold border-none focus:ring-0 p-0"
                                            style={{ color: editingReport.status === 'Active' ? 'green' : 'orange' }}
                                            value={editingReport.status}
                                            onChange={(e) => setEditingReport({ ...editingReport, status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="On Leave">On Leave</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="border border-gray-200 p-5 rounded-lg bg-gray-50">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Zone</div>
                                        <input
                                            className="w-full bg-transparent text-xl font-bold border-none focus:ring-0 p-0"
                                            value={editingReport.zone}
                                            onChange={(e) => setEditingReport({ ...editingReport, zone: e.target.value })}
                                        />
                                    </div>
                                    <div className="border border-gray-200 p-5 rounded-lg bg-gray-50">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customers Attended</div>
                                        <div className="text-xl font-bold text-gray-800">{getCustomersAttendedCount(editingReport.id)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* NEW: Customer Interaction Logs UI */}
                            <h2 className="text-lg font-bold mb-4 mt-8 border-b pb-2">Customer Interaction Logs</h2>
                            <div className="space-y-6 mb-8">
                                {getAttendedCustomers(editingReport.id).map(customer => {
                                    const details = getSessionDetails(editingReport.id, customer.id);
                                    return (
                                        <div key={customer.id} className="border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                                            {/* Card Header */}
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 rounded-t-lg flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {customer.short_id ? customer.short_id.substring(0, 2) : 'C'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-gray-900">Customer {customer.short_id || customer.id}</h4>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500 font-medium">
                                                    {new Date().toLocaleDateString()}
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Jewels Shown */}
                                                <div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Shown
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        {details.jewelsShown.map(j => (
                                                            <div key={j.id} className="flex justify-between items-center text-sm p-1.5 hover:bg-gray-50 rounded">
                                                                <span className="text-gray-700 font-medium">{j.name}</span>
                                                                <span className="text-[10px] text-gray-400 font-mono">#{j.id}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Jewels Sold */}
                                                <div className="relative">
                                                    {/* Divider for MD+ screens */}
                                                    <div className="hidden md:block absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-gray-100 to-transparent"></div>

                                                    <div className="md:pl-6 h-full">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Sold
                                                        </div>
                                                        {details.jewelsSold.length > 0 ? (
                                                            <div className="space-y-1.5">
                                                                {details.jewelsSold.map(j => (
                                                                    <div key={j.id} className="flex justify-between items-center text-sm p-1.5 bg-green-50/50 rounded border border-green-100/50">
                                                                        <span className="text-green-800 font-bold">{j.name}</span>
                                                                        <span className="text-[10px] text-green-600 font-mono">#{j.id}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="h-full flex flex-col justify-center">
                                                                <span className="text-xs text-gray-400 italic">No purchases recorded.</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Comments */}
                                                <div className="relative">
                                                    {/* Divider for MD+ screens */}
                                                    <div className="hidden md:block absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-gray-100 to-transparent"></div>

                                                    <div className="md:pl-6 h-full flex flex-col">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Notes
                                                        </div>
                                                        <div className="flex-1 p-2 bg-gray-50/50 rounded text-xs text-gray-600 italic leading-relaxed border border-gray-100">
                                                            "{details.comments}"
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 border border-gray-200 p-5 rounded-lg bg-gray-50">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Managerial Notes (Printable)</div>
                                <textarea
                                    className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:ring-1 focus:ring-black min-h-[100px]"
                                    placeholder="Enter performance feedback, goals, or notes for the salesperson..."
                                    value={editingReport.managerialNotes || ""}
                                    onChange={(e) => setEditingReport({ ...editingReport, managerialNotes: e.target.value })}
                                />
                            </div>

                            {/* Footer */}
                            <div className="mt-12 text-center text-xs text-gray-400 border-t pt-4">
                                <p>© 2026 DataGold Analytics. Internal Use Only.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
