
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

export const NotificationPoller = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [lastTimestamp, setLastTimestamp] = useState(new Date().toISOString());
    const [unreadCount, setUnreadCount] = useState(0);
    const [latestTrigger, setLatestTrigger] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const isFirstPoll = useRef(true);
    const popupTimerRef = useRef(null);

    useEffect(() => {
        console.log("NotificationPoller Mounted - User:", user?.username || 'Guest');
    }, []);

    useEffect(() => {
        if (!user) return;

        const poll = async () => {
            try {
                const url = `http://${window.location.hostname}:8000/api/notifications/poll?salesperson_id=${user.id}&last_timestamp=${lastTimestamp}`;
                // console.log("Polling [NotificationPoller]:", url);

                const response = await fetch(url);
                if (!response.ok) return;

                const data = await response.json();

                if (data.notifications && data.notifications.length > 0) {
                    const newCount = data.notifications.length;
                    const latest = data.notifications[0];

                    // If it's the first poll, we just want to sync our timestamp to the server's latest
                    // We don't want to alert the user about old stuff
                    if (isFirstPoll.current) {
                        console.log("Initial Sync: Setting timestamp to latest trigger without alerting.");
                        setLastTimestamp(latest.timestamp);
                        isFirstPoll.current = false;
                        return;
                    }

                    console.log(`New Triggers Found: ${newCount}`, latest);

                    setUnreadCount(prev => prev + newCount);
                    setLatestTrigger(latest);
                    // Show popup for new customer
                    setShowPopup(true);
                    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
                    popupTimerRef.current = setTimeout(() => setShowPopup(false), 5000); // Hide after 5 seconds

                    // Use server timestamp to avoid timezone loops
                    setLastTimestamp(latest.timestamp);
                } else {
                    // If no data found, we still mark first poll as done so subsequent REAL triggers count
                    isFirstPoll.current = false;
                }
            } catch (error) {
                console.error("Polling error", error);
            }
        };

        const interval = setInterval(poll, 3000); // 3 seconds
        return () => {
            clearInterval(interval);
            if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
        };
    }, [user, lastTimestamp]);

    const handleClick = () => {
        if (unreadCount === 0 && !latestTrigger) return;

        // Navigate to Live Customers and highlight the most recent one
        const highlightId = latestTrigger ? latestTrigger.customer_id : '';

        navigate(`/customers?highlight=${highlightId}`, {
            state: { zone: { id: 'gold', name: 'Gold Zone' } }
        });

        // Reset count
        setUnreadCount(0);
        setLatestTrigger(null);
    };

    // Always show the bell if there are notifications, or if you want it always visible remove the check
    // if (unreadCount === 0) return null; 

    return (
        <div style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            pointerEvents: 'none' // Allow clicks to pass through gap to underlying UI
        }}>
            {/* Popup Notification */}
            {showPopup && latestTrigger && (
                <div
                    onClick={handleClick}
                    className="p-4 rounded-2xl cursor-pointer hover:bg-white/5 animate-popup-slide"
                    style={{
                        minWidth: '340px',
                        pointerEvents: 'auto',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        boxShadow: '0 15px 35px rgba(212, 175, 55, 0.15), inset 0 0 15px rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center text-gold border border-gold/50 shadow-lg">
                            <Bell size={24} className="animate-wiggle" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-black uppercase text-gold tracking-[0.2em]">Live Arrival</span>
                                <span className="text-[8px] text-gray-500 font-medium">Just now</span>
                            </div>
                            <h4 className="text-base font-bold text-white leading-tight mb-0.5">
                                Customer {latestTrigger.customer_id}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Click to start assistance
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Bell Icon */}
            <div
                onClick={handleClick}
                style={{
                    cursor: unreadCount > 0 ? 'pointer' : 'default',
                    pointerEvents: 'auto'
                }}
                className="hover:scale-110 transition-transform"
            >
                <div className={`relative backdrop-blur-md p-3 rounded-full border shadow-2xl transition-all duration-300 ${unreadCount > 0 ? 'bg-gold/10 border-gold/50 shadow-gold/20' : 'bg-white/10 border-white/20'}`}>
                    <Bell
                        size={28}
                        className={unreadCount > 0 ? 'text-gold animate-wiggle' : 'text-white/60'}
                        color={unreadCount > 0 ? '#D4AF37' : 'rgba(255,255,255,0.6)'}
                    />

                    {/* Badge */}
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0a0a0a] animate-bounce">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes popupSlide {
                    0% { transform: translateX(30px); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                .animate-popup-slide {
                    animation: popupSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes wiggle {
                    0%, 100% { transform: rotate(-8deg); }
                    50% { transform: rotate(8deg); }
                }
                .animate-wiggle {
                    animation: wiggle 0.3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
