import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Camera, Settings, Save, Video, Aperture, ShieldCheck, Eye, Lock } from 'lucide-react';

const cameraBrands = [
    { id: 'hitek', name: 'Hikvision', icon: Video },
    { id: 'visionpro', name: 'CP Plus', icon: Aperture },
    { id: 'securecam', name: 'SecureCam', icon: ShieldCheck },
    { id: 'eagleeye', name: 'EagleEye', icon: Eye },
    { id: 'camguard', name: 'CamGuard', icon: Lock }
];

export default function Integrations() {
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [config, setConfig] = useState({
        ip: '',
        port: '',
        rtcpPort: '',
        username: '',
        password: ''
    });

    const handleBrandClick = (brand) => {
        setSelectedBrand(brand);
        // Reset config or load existing config for this brand if available
        setConfig({
            ip: '',
            port: '',
            rtcpPort: '',
            username: '',
            password: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert(`Configuration saved for ${selectedBrand.name}`);
        // Here you would typically save to backend
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Camera Integrations</h1>
                <p className="text-muted-foreground mt-2">Configure connection details for your camera systems</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <h2 className="text-lg font-semibold mb-4">Available Brands</h2>
                    <div className="space-y-2">
                        {cameraBrands.map((brand) => (
                            <div
                                key={brand.id}
                                onClick={() => handleBrandClick(brand)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md flex items-center gap-3 ${selectedBrand?.id === brand.id
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card hover:bg-muted'
                                    }`}
                            >
                                <brand.icon className="h-6 w-6" />
                                <span className="font-medium">{brand.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2">
                    {selectedBrand ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Configure {selectedBrand.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">IP Address</label>
                                            <input
                                                type="text"
                                                name="ip"
                                                value={config.ip}
                                                onChange={handleInputChange}
                                                placeholder="192.168.1.100"
                                                className="w-full p-2 rounded-md border bg-background"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Port</label>
                                            <input
                                                type="number"
                                                name="port"
                                                value={config.port}
                                                onChange={handleInputChange}
                                                placeholder="8080"
                                                className="w-full p-2 rounded-md border bg-background"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">RTCP Port</label>
                                        <input
                                            type="number"
                                            name="rtcpPort"
                                            value={config.rtcpPort}
                                            onChange={handleInputChange}
                                            placeholder="554"
                                            className="w-full p-2 rounded-md border bg-background"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={config.username}
                                                onChange={handleInputChange}
                                                placeholder="admin"
                                                className="w-full p-2 rounded-md border bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={config.password}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                className="w-full p-2 rounded-md border bg-background"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <Button type="submit" className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            Save Configuration
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/50">
                            <Camera className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Select a camera brand to configure</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
