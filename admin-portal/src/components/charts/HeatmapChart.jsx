import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { fetchActivityHeatmap } from '../../services/api';

export function HeatmapChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const hours = Array.from({ length: 12 }, (_, i) => i + 10); // 10 AM to 9 PM

    useEffect(() => {
        const loadActivityData = async () => {
            try {
                const response = await fetchActivityHeatmap();
                setData(response);
            } catch (error) {
                console.error("Error loading heatmap data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadActivityData();
    }, []);

    const preferredOrder = ["Entrance", "First Floor", "Second Floor", "Exit"];
    const floors = preferredOrder.filter(f => data.some(item => item.floor === f));

    // Also include any other floors that might come from the DB but aren't in the preferred list
    const otherFloors = Array.from(new Set(data.map(item => item.floor)))
        .filter(f => !preferredOrder.includes(f))
        .sort();

    const allFloors = [...floors, ...otherFloors];

    // Function to get intensity from real data
    const getIntensity = (floor, hour) => {
        const entry = data.find(item => item.floor === floor && item.hour === hour);
        if (!entry) return 0;

        // Find max count to normalize intensity
        const maxCount = Math.max(...data.map(d => d.count), 1);
        return (entry.count / maxCount);
    };

    if (loading) {
        return <div className="h-40 flex items-center justify-center text-muted-foreground">Loading activity data...</div>;
    }

    if (allFloors.length === 0) {
        return <div className="h-40 flex items-center justify-center text-muted-foreground italic">No activity data recorded for today.</div>;
    }

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex">
                <div className="w-24"></div>
                {hours.map(h => (
                    <div key={h} className="flex-1 text-center text-[10px] text-muted-foreground">
                        {h > 12 ? `${h - 12}PM` : `${h}${h === 12 ? 'PM' : 'AM'}`}
                    </div>
                ))}
            </div>
            {allFloors.map(floor => (
                <div key={floor} className="flex items-center">
                    <div className="w-24 text-[10px] font-medium text-muted-foreground truncate pr-2" title={floor}>{floor}</div>
                    {hours.map(hour => {
                        const intensity = getIntensity(floor, hour);
                        const count = data.find(item => item.floor === floor && item.hour === hour)?.count || 0;
                        return (
                            <div
                                key={`${floor}-${hour}`}
                                className="flex-1 h-12 m-0.5 rounded-sm transition-all hover:ring-2 ring-primary cursor-help"
                                style={{
                                    backgroundColor: intensity > 0 ? `hsl(var(--primary) / ${Math.max(intensity, 0.1)})` : '#f3f4f6'
                                }}
                                title={`${floor} @ ${hour}:00: ${count} detections`}
                            />
                        );
                    })}
                </div>
            ))}
            <div className="flex justify-end pt-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>Less Activity</span>
                    <div className="flex gap-0.5">
                        {[0.1, 0.3, 0.6, 0.9].map(i => (
                            <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `hsl(var(--primary) / ${i})` }} />
                        ))}
                    </div>
                    <span>Peak Activity</span>
                </div>
            </div>
        </div>
    );
}
