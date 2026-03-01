import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    CheckCircle, ArrowLeft, Clock, Package,
    IndianRupee, MessageCircle, ArrowRight,
    Users, TrendingUp, Calendar, Zap
} from 'lucide-react';
import { useSession } from '../context/SessionContext';

// Quick tags for comments
const QUICK_TAGS = [
    { label: "Liked", icon: "👍" },
    { label: "High Price", icon: "💰" },
    { label: "Unique", icon: "✨" },
    { label: "Will Return", icon: "🔄" },
    { label: "Bought", icon: "🛍️" }
];

export default function Summary() {
    const navigate = useNavigate();
    const { scannedItems, activeSession, endSession, updateScanComment } = useSession();

    // Performance Stats State
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    // Get user from localStorage (mock auth)
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Fetch stats on mount
    useEffect(() => {
        const fetchStats = async () => {
            if (!user.id) return;
            try {
                const response = await axios.get(`http://${window.location.hostname}:8000/api/operational/salesperson-stats/${user.id}`);
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    const totalValue = scannedItems.reduce((acc, item) => acc + item.price, 0);

    const handleFinish = async () => {
        try {
            await endSession();
            navigate('/zones');
        } catch (error) {
            alert('Failed to end session');
        }
    };

    const appendTagToComment = (itemId, tag, currentComment) => {
        const newComment = currentComment ? `${currentComment} [${tag}]` : `[${tag}]`;
        updateScanComment(itemId, newComment);
    };

    return (
        <div className="summary-page">
            <div className="summary-container">
                {/* Header Section */}
                <div className="header-section">
                    <div>
                        <h1 className="page-title">
                            <Users className="text-gold" size={32} />
                            Performance Dashboard
                        </h1>
                        <p className="subtitle">Hello, <span className="text-dark font-bold">{user.name || 'Salesperson'}</span>! Here is your impact summary.</p>
                    </div>
                    <div className="session-tag-container">
                        <span className="session-label">Current Session ID</span>
                        <span className="session-id">#{activeSession?.id || '---'}</span>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="kpi-grid">
                    {/* Customers Attended */}
                    <div className="light-card kpi-card">
                        <div className="bg-icon">
                            <Users size={80} />
                        </div>
                        <p className="kpi-label">Customers Attended</p>
                        <div className="kpi-value-row">
                            <h2 className="kpi-value">{loadingStats ? '-' : stats?.customers_attended}</h2>
                            <span className="kpi-trend"><TrendingUp size={12} style={{ marginRight: '0.25rem' }} /> Today</span>
                        </div>
                    </div>

                    {/* Jewellery Displayed */}
                    <div className="light-card kpi-card">
                        <div className="bg-icon">
                            <Package size={80} />
                        </div>
                        <p className="kpi-label">Jewellery Shown</p>
                        <div className="kpi-value-row">
                            <h2 className="kpi-value">{loadingStats ? '-' : stats?.items_shown}</h2>
                            <span className="kpi-unit">Items</span>
                        </div>
                    </div>

                    {/* Revenue Potential */}
                    <div className="light-card kpi-card revenue-card">
                        <div className="revenue-gradient"></div>
                        <div className="bg-icon">
                            <IndianRupee size={80} />
                        </div>
                        <p className="kpi-label text-gold">Revenue Potential</p>
                        <div className="kpi-value-row">
                            <h2 className="kpi-value text-gold">₹{(stats?.total_revenue_potential / 100000).toFixed(1)}L</h2>
                        </div>
                    </div>

                    {/* Avg Session Time */}
                    <div className="light-card kpi-card">
                        <div className="bg-icon">
                            <Clock size={80} />
                        </div>
                        <p className="kpi-label">Avg. Session Time</p>
                        <div className="kpi-value-row">
                            <h2 className="kpi-value">{loadingStats ? '-' : stats?.avg_session_minutes}</h2>
                            <span className="kpi-unit">min</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area - Split View */}
                <div className="split-view">

                    {/* Left: Session Details List */}
                    <div className="list-section">
                        <div className="list-header">
                            <h3 className="section-title">
                                <Zap className="text-gold" size={20} />
                                Scanning Review
                            </h3>
                            {activeSession && (
                                <span className="active-badge">
                                    <span className="pulse-dot"></span>
                                    Active
                                </span>
                            )}
                        </div>

                        <div className="items-list">
                            {scannedItems.length === 0 ? (
                                <div className="light-card empty-state">
                                    <Package size={48} className="empty-icon" />
                                    <p className="text-gray-600 font-medium">No items scanned in this session.</p>
                                    <p className="text-gray-400 text-sm mt-1">Scan items to see them appear here.</p>
                                </div>
                            ) : (
                                scannedItems.map((item) => (
                                    <div key={item.id} className="light-card item-card">
                                        <div className="item-row">
                                            <div className="item-info-group">
                                                <div className="item-thumb">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="item-name">{item.name}</h4>
                                                    <div className="item-meta">
                                                        <span className="meta-tag">{item.barcode}</span>
                                                        <span className="meta-dot"></span>
                                                        <span>{item.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="item-price-group">
                                                <div className="item-price">₹{item.price.toLocaleString()}</div>
                                                <div className="item-time">
                                                    {new Date(item.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Professional Feedback UI - Light Theme */}
                                        <div className="feedback-section">
                                            <div className="feedback-input-container">
                                                <textarea
                                                    className="feedback-input"
                                                    placeholder="Add customer feedback or notes..."
                                                    value={item.comment || ''}
                                                    onChange={(e) => updateScanComment(item.id, e.target.value)}
                                                />
                                            </div>
                                            {/* Clean Quick Tags */}
                                            <div className="tags-container no-scrollbar">
                                                {QUICK_TAGS.map((tag) => (
                                                    <button
                                                        key={tag.label}
                                                        onClick={() => appendTagToComment(item.id, tag.label, item.comment)}
                                                        className="tag-pill"
                                                    >
                                                        <span style={{ marginRight: '4px' }}>{tag.icon}</span>
                                                        {tag.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Summary Card (Sticky) */}
                    <div className="sidebar-section">
                        <div className="sticky-sidebar">
                            <div className="light-card summary-card">

                                <h3 className="summary-title">Total Session Value</h3>
                                <div className="summary-total">
                                    <span className="currency-symbol">₹</span>
                                    {(totalValue / 1000).toFixed(1)}k
                                </div>

                                <div className="summary-stats-box">
                                    <div className="stat-line">
                                        <span className="stat-label">Items Shown</span>
                                        <span className="stat-value">{scannedItems.length}</span>
                                    </div>
                                    <div className="stat-divider"></div>
                                    <div className="stat-line">
                                        <span className="stat-label">Customer ID</span>
                                        <span className="stat-value highlight">
                                            #{activeSession?.customer_id}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleFinish}
                                    className="btn-gold finish-btn"
                                >
                                    Complete Session
                                    <CheckCircle size={20} />
                                </button>

                                <button
                                    onClick={() => navigate(-1)}
                                    className="back-btn"
                                >
                                    <ArrowLeft size={14} />
                                    Back to Scanner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CSS Styles Block - Light Theme & Responsiveness */}
                <style>{`
                    .summary-page {
                        width: 100%;
                        min-height: 100vh;
                        overflow-x: hidden;
                        color: #1a1a1a; /* Dark text for light bg */
                    }
                    
                    .summary-container {
                        width: 100%;
                        max-width: 1280px;
                        margin: 0 auto;
                        padding: 2rem;
                        padding-bottom: 8rem;
                        box-sizing: border-box;
                    }

                    /* Cards - White with Shadow */
                    .light-card {
                        background: #ffffff;
                        border: 1px solid #e5e7eb;
                        border-radius: 1.25rem;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    }

                    /* Header */
                    .header-section {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 2rem;
                        flex-wrap: wrap;
                        gap: 1rem;
                    }

                    .page-title {
                        font-size: 1.75rem;
                        font-weight: 900;
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        margin-bottom: 0.25rem;
                        color: #1a1a1a; /* Dark Title */
                    }
                    
                    .subtitle {
                        color: #6b7280;
                        font-size: 0.875rem;
                        font-weight: 500;
                    }
                    
                    .text-dark { color: #111827; }

                    .session-tag-container {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                    }
                    
                    .session-label {
                        font-size: 0.7rem;
                        font-weight: 700;
                        color: #6b7280;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 0.25rem;
                    }

                    .session-id {
                        font-size: 1.25rem;
                        font-weight: 900;
                        color: var(--gold-primary);
                    }

                    /* KPI Grid */
                    .kpi-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                        gap: 1.5rem;
                        margin-bottom: 2.5rem;
                    }

                    .kpi-card {
                        padding: 1.5rem;
                        padding-top: 2rem;
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        min-height: 140px;
                         /* Ensure cards are white */
                        background: white;
                    }

                    .bg-icon {
                        position: absolute;
                        top: 0;
                        right: 0;
                        padding: 1rem;
                        opacity: 0.05;
                        color: black; /* Dark icon */
                    }

                    .kpi-label {
                        color: #6b7280;
                        font-size: 0.75rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 0.5rem;
                        position: relative; 
                        z-index: 2;
                    }

                    .kpi-value-row {
                        display: flex;
                        align-items: baseline;
                        gap: 0.5rem;
                        position: relative; 
                        z-index: 2;
                    }

                    .kpi-value {
                        font-size: 2.25rem;
                        font-weight: 800;
                        color: #111827; /* Dark text */
                        line-height: 1;
                    }

                    .kpi-trend {
                        font-size: 0.75rem;
                        font-weight: bold;
                        color: #059669; /* Green */
                        background: #ecfdf5;
                        padding: 0.125rem 0.5rem;
                        border-radius: 1rem;
                    }
                    
                    .kpi-unit {
                        font-size: 0.8rem;
                        font-weight: bold;
                        color: #9ca3af;
                    }

                    .revenue-card {
                        border-color: rgba(212,175,55,0.4);
                        background: #fffdf0; /* Very subtle gold/white tint */
                    }

                    /* Split View */
                    .split-view {
                        display: flex;
                        gap: 2rem;
                        align-items: flex-start;
                        flex-wrap: wrap;
                    }

                    .list-section {
                        flex: 1;
                        min-width: 300px;
                    }

                    .sidebar-section {
                        width: 350px;
                        flex-shrink: 0;
                        position: relative;
                    }

                    .sticky-sidebar {
                        position: sticky;
                        top: 2rem;
                    }

                    /* List Header */
                    .list-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 1rem;
                    }
                    
                    .section-title {
                        font-size: 1.25rem;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        color: #111827; /* Dark */
                    }

                    /* Active Badge */
                    .active-badge {
                        padding: 0.25rem 0.75rem;
                        border-radius: 1rem;
                        background: #ecfdf5;
                        border: 1px solid #a7f3d0;
                        color: #059669;
                        font-size: 0.75rem;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 0.35rem;
                    }
                    
                    .pulse-dot {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background: #10b981;
                    }

                    /* Items List */
                    .items-list {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .item-card {
                        padding: 1.5rem;
                    }

                    .item-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 1.25rem;
                        flex-wrap: wrap;
                        gap: 1rem;
                    }
                    
                    .item-info-group {
                        display: flex;
                        gap: 1rem;
                    }
                    
                    .item-thumb {
                        width: 3.5rem;
                        height: 3.5rem;
                        border-radius: 0.75rem;
                        background: #f9fafb;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 1px solid #e5e7eb;
                        color: var(--gold-primary);
                    }

                    .item-name {
                        font-weight: bold;
                        font-size: 1.125rem;
                        color: #111827;
                        margin-bottom: 0.25rem;
                    }

                    .item-meta {
                        color: #6b7280;
                        font-size: 0.75rem;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    .meta-tag {
                        background: #f3f4f6;
                        padding: 0.1rem 0.5rem;
                        border-radius: 0.25rem;
                        color: #4b5563;
                        border: 1px solid #e5e7eb;
                    }
                    
                    .meta-dot {
                        width: 4px;
                        height: 4px;
                        border-radius: 50%;
                        background: #d1d5db;
                    }

                    .item-price {
                        font-size: 1.25rem;
                        font-weight: 800;
                        color: #111827;
                        text-align: right;
                    }
                    
                    .item-time {
                        font-size: 0.75rem;
                        color: #9ca3af;
                        text-align: right;
                    }

                    /* Feedback Section - Light & Clean */
                    .feedback-section {
                        margin-top: 0.5rem;
                        border-top: 1px dashed #e5e7eb;
                        padding-top: 1rem;
                    }

                    .feedback-input {
                        width: 100%;
                        background: #f9fafb; 
                        border: 1px solid #e5e7eb;
                        border-radius: 0.75rem;
                        padding: 0.75rem 1rem;
                        color: #1f2937;
                        font-size: 0.875rem;
                        font-family: inherit;
                        min-height: 3rem;
                        resize: none;
                        outline: none;
                        transition: all 0.2s;
                    }

                    .feedback-input:focus {
                        border-color: var(--gold-primary);
                        background: #fff;
                        box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
                    }
                    
                    .feedback-input::placeholder {
                        color: #9ca3af;
                    }

                    .tags-container {
                        display: flex;
                        gap: 0.5rem;
                        overflow-x: auto;
                        padding: 0.75rem 0 0 0;
                    }

                    .tag-pill {
                        background: #fff;
                        border: 1px solid #e5e7eb;
                        color: #4b5563;
                        padding: 0.25rem 0.75rem;
                        border-radius: 2rem;
                        font-size: 0.75rem;
                        font-weight: 600;
                        cursor: pointer;
                        white-space: nowrap;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    }

                    .tag-pill:hover {
                        border-color: var(--gold-primary);
                        color: var(--gold-primary);
                        background: #fffdf0;
                    }

                    /* Summary Card - WHITE as requested */
                    .summary-card {
                        padding: 2rem;
                        /* Inherits .light-card (white bg) */
                        text-align: center;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
                        border-color: rgba(212,175,55,0.3);
                    }

                    .summary-title {
                        color: #6b7280;
                        font-size: 0.75rem;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 0.5rem;
                    }

                    .summary-total {
                        color: #111827; /* Dark black */
                        font-size: 2.5rem;
                        font-weight: 900;
                        margin-bottom: 1.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.25rem;
                        line-height: 1;
                    }
                    
                    .currency-symbol {
                        color: var(--gold-primary);
                        font-size: 1.5rem;
                        margin-top: 0.25rem;
                    }

                    .summary-stats-box {
                        margin-bottom: 1.5rem;
                        background: #f9fafb;
                        padding: 1rem;
                        border-radius: 0.75rem;
                        border: 1px solid #f3f4f6;
                    }

                    .stat-line {
                        display: flex;
                        justify-content: space-between;
                        font-size: 0.875rem;
                    }
                    
                    .stat-label {
                        color: #6b7280;
                        font-weight: 600;
                    }
                    
                    .stat-value {
                        color: #111827;
                        font-weight: 800;
                    }
                    
                    .stat-divider {
                        width: 100%;
                        height: 1px;
                        background: #e5e7eb;
                        margin: 0.5rem 0;
                    }

                    .finish-btn {
                        width: 100%;
                        padding: 0.875rem;
                        border-radius: 0.75rem;
                        font-weight: 800;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        font-size: 1rem;
                        background: var(--gold-primary);
                        color: white; /* Ensure text is white on gold */
                        border: none;
                        cursor: pointer;
                        box-shadow: 0 4px 6px -1px rgba(212, 175, 55, 0.3);
                        transition: transform 0.1s;
                    }
                    .finish-btn:hover {
                        transform: translateY(-1px);
                    }

                    .back-btn {
                        margin-top: 1rem;
                        font-size: 0.75rem;
                        font-weight: 700;
                        color: #6b7280;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        background: none;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        width: 100%;
                        transition: color 0.2s;
                    }
                    
                    .back-btn:hover {
                        color: #111827;
                    }

                    .empty-state {
                        padding: 3rem;
                        text-align: center;
                        /* Inherits light card */
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .text-gold { color: var(--gold-primary); }

                    /* Media Queries match previous responsive logic */
                    @media (max-width: 1024px) {
                        .split-view { flexDirection: column; }
                        .list-section, .sidebar-section { width: 100%; }
                        .sticky-sidebar { position: static; }
                        .summary-card { padding: 1.5rem; }
                        .summary-stats-box { display: flex; gap: 2rem; }
                        .stat-divider { display: none; }
                        .finish-btn { width: auto; padding: 0.75rem 2rem; }
                        .back-btn { display: none; }
                    }
                    
                    @media (max-width: 640px) {
                        .summary-card { flexDirection: column; gap: 1rem; }
                        .summary-stats-box { flexDirection: column; gap: 0.5rem; width: 100%; }
                        .finish-btn { width: 100%; }
                        .back-btn { display: flex; }
                    }
                `}</style>
            </div>
        </div>
    );
}
