import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { dashboardAPI } from '../api/client';
import {
    TrendingUp, TrendingDown, DollarSign, Layers,
    Camera, Map, Bot, History, FileText, Settings, HelpCircle,
    Lightbulb, Zap, ArrowRight, Store, Bell, Calendar as CalendarIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActionGridItem = ({ icon: Icon, label, path, color = 'var(--primary-color)', bgColor }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    return (
        <Card
            padding="0.875rem"
            hoverable
            onClick={() => navigate(path)}
            className="animate-slide-up"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
                cursor: 'pointer',
                border: hovered ? `1.5px solid ${color}30` : '1px solid var(--border-color)',
                transition: 'all 0.2s',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{
                backgroundColor: bgColor || `${color}12`,
                color: color,
                padding: '0.625rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
            }}>
                <Icon size={20} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '500', textAlign: 'center', color: 'var(--text-body)', lineHeight: 1.2 }}>
                {label}
            </span>
        </Card>
    );
};

const MetricCard = ({ icon: Icon, label, value, color, subLabel }) => (
    <Card
        padding="1rem"
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            borderLeft: `3px solid ${color}`,
        }}
    >
        <div style={{
            backgroundColor: `${color}12`,
            color: color,
            padding: '0.625rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}>
            <Icon size={20} />
        </div>
        <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginBottom: '2px' }}>
                {label}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value}
            </div>
            {subLabel && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>{subLabel}</div>}
        </div>
    </Card>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await dashboardAPI.getSummary();
                if (result.success) setData(result);
            } catch (e) {
                console.error('Dashboard fetch error', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex-center" style={{ height: '50vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '3px solid var(--primary-light)',
                borderTopColor: 'var(--primary-color)',
                animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p className="text-muted">Loading your farm data...</p>
        </div>
    );

    const metrics = data?.metrics || { earned: 0, spent: 0, profit: 0, areas: 0 };
    const recentActs = data?.recentActivities || [];

    return (
        <div className="page-wrapper">

            {/* Metrics Grid — 2 cols mobile, 4 cols desktop */}
            <div>
                <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                    Overview
                </h2>
                <div className="metrics-row">
                    <MetricCard icon={TrendingUp} label="Total Earned" value={`₹${metrics.earned.toLocaleString()}`} color="var(--primary-color)" subLabel="Revenue" />
                    <MetricCard icon={TrendingDown} label="Total Spent" value={`₹${metrics.spent.toLocaleString()}`} color="var(--accent-orange)" subLabel="Expenses" />
                    <MetricCard icon={DollarSign} label="Net Profit" value={`₹${metrics.profit.toLocaleString()}`} color={metrics.profit >= 0 ? 'var(--primary-color)' : 'var(--accent-red)'} subLabel={metrics.profit >= 0 ? 'Positive' : 'Loss'} />
                    <MetricCard icon={Layers} label="Farm Areas" value={metrics.areas} color="#8b5cf6" subLabel="Sections" />
                </div>
            </div>

            {/* Quick Actions — 4 cols always, compact on mobile */}
            <div>
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Quick Actions
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Zap size={12} color="var(--accent-orange)" fill="var(--accent-orange)" /> Fast access
                    </span>
                </div>
                <div className="actions-grid">
                    <ActionGridItem icon={Camera}       label="Record Sale"   path="/record-sale"    color="var(--primary-color)" />
                    <ActionGridItem icon={DollarSign}   label="Add Expense"   path="/add-expense"    color="var(--accent-orange)" />
                    <ActionGridItem icon={Bell}         label="Tasks"         path="/task-reminders" color="var(--primary-color)" />
                    <ActionGridItem icon={CalendarIcon} label="Calendar"      path="/calendar"       color="#6366f1" />
                    <ActionGridItem icon={Map}          label="Farm Areas"    path="/sections"       color="#8b5cf6" />
                    <ActionGridItem icon={Bot}          label="AI Helper"     path="/ai-assistant"   color="#06b6d4" />
                    <ActionGridItem icon={FileText}     label="Reports"       path="/reports"        color="var(--primary-color)" />
                    <ActionGridItem icon={Store}        label="Mandi Rates"   path="/mandi-prices"   color="var(--primary-dark)" />
                </div>
            </div>

            {/* AI Tips Banner — wraps on small screens */}
            <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: 'var(--border-radius-lg)',
                border: '1px solid #bbf7d0',
                padding: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.75rem',
            }}>
                <div style={{
                    width: 40, height: 40,
                    background: 'linear-gradient(135deg, var(--accent-orange), #f97316)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Lightbulb size={20} color="white" />
                </div>
                <div style={{ flex: '1 1 120px', minWidth: 0 }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '2px', color: 'var(--text-dark)' }}>
                        Get Smart Farming Tips
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                        AI-powered advice for your farm.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/ai-assistant')}
                    style={{
                        background: 'var(--primary-color)',
                        color: 'white', border: 'none',
                        padding: '0.45rem 0.875rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 5,
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        alignSelf: 'center',
                    }}
                >
                    Ask AI <ArrowRight size={13} />
                </button>
            </div>

            {/* Recent Activities */}
            <Card>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <History size={16} color="var(--text-muted)" /> Recent Activity
                    </h3>
                    <a href="/transactions" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        View All <ArrowRight size={12} />
                    </a>
                </div>

                {recentActs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                            <History size={20} color="var(--primary-color)" />
                        </div>
                        <p className="text-muted">No transactions yet. Record a sale or expense to get started!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {recentActs.map((act) => (
                            <div
                                key={act.id}
                                style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0.75rem 0',
                                    borderBottom: recentActs.indexOf(act) < recentActs.length - 1 ? '1px solid var(--border-color)' : 'none',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '8px',
                                        background: act.transaction_type === 'sale' ? 'var(--primary-100)' : 'var(--accent-orange-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        {act.transaction_type === 'sale'
                                            ? <TrendingUp size={14} color="var(--primary-dark)" />
                                            : <TrendingDown size={14} color="var(--accent-orange)" />
                                        }
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-dark)' }}>
                                            {act.description || act.transaction_type}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {act.transaction_date}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    color: act.transaction_type === 'sale' ? 'var(--primary-color)' : 'var(--accent-red)',
                                }}>
                                    {act.transaction_type === 'sale' ? '+' : '-'}₹{act.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
