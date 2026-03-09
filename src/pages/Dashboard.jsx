import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import { dashboardAPI } from '../api/client';
import {
    TrendingUp, TrendingDown, DollarSign, Layers,
    Camera, Map, Bot, History, FileText, Settings, HelpCircle,
    Lightbulb, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActionGridItem = ({ icon: Icon, label, path, color = 'var(--primary-color)' }) => {
    const navigate = useNavigate();
    return (
        <Card
            padding="1rem"
            hoverable
            onClick={() => navigate(path)}
            className="animate-slide-up"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
        >
            <div style={{
                backgroundColor: `${color}15`,
                color: color,
                padding: '0.75rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '500', textAlign: 'center' }}>{label}</span>
        </Card>
    );
};

const MetricItem = ({ icon: Icon, label, value, color }) => (
    <Card padding="0.75rem" style={{ flex: '1', minWidth: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ backgroundColor: `${color}15`, color: color, padding: '0.5rem', borderRadius: '50%', marginBottom: '0.5rem' }}>
            <Icon size={18} />
        </div>
        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{label}</div>
        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{value}</div>
    </Card>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await dashboardAPI.getSummary();
                if (result.success) setData(result);
            } catch (e) {
                console.error("Dashboard fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex-center" style={{ height: '50vh' }}>Loading...</div>;

    const metrics = data?.metrics || { earned: 0, spent: 0, profit: 0, areas: 0 };
    const recentActs = data?.recentActivities || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Header />

            {/* Metrics Row */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <MetricItem icon={TrendingUp} label="Earned" value={`₹${metrics.earned}`} color="var(--primary-color)" />
                <MetricItem icon={TrendingDown} label="Spent" value={`₹${metrics.spent}`} color="var(--accent-orange)" />
                <MetricItem icon={DollarSign} label="Profit" value={`₹${metrics.profit}`} color="var(--primary-color)" />
                <MetricItem icon={Layers} label="Areas" value={metrics.areas} color="var(--primary-color)" />
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: '0.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={18} color="var(--accent-orange)" fill="var(--accent-orange)" /> Quick Actions
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                    <ActionGridItem icon={Camera} label="Record Sale" path="/record-sale" color="var(--primary-color)" />
                    <ActionGridItem icon={DollarSign} label="Add Expense" path="/add-expense" color="var(--primary-color)" />
                    <ActionGridItem icon={Map} label="Manage Areas" path="/sections" color="var(--primary-color)" />
                    <ActionGridItem icon={Bot} label="AI Helper" path="/ai-assistant" color="var(--primary-color)" />
                    <ActionGridItem icon={History} label="View Records" path="/transactions" color="var(--primary-color)" />
                    <ActionGridItem icon={FileText} label="Reports" path="/reports" color="var(--primary-color)" />
                    <ActionGridItem icon={Settings} label="Settings" path="/profile" color="var(--primary-color)" />
                    <ActionGridItem icon={HelpCircle} label="Get Help" path="/help" color="var(--primary-color)" />
                </div>
            </div>

            {/* AI Tips Banner */}
            <Card style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--primary-light)',
                borderWidth: '2px',
                background: 'linear-gradient(to right bottom, #e8f5e9, #c8e6c9)',
                marginTop: '0.5rem',
                textAlign: 'center',
                padding: '1.5rem'
            }}>
                <div style={{
                    backgroundColor: 'var(--accent-orange)',
                    color: 'white',
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                }}>
                    <Lightbulb size={20} />
                </div>
                <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Get Smart Farming Tips! 💡</h3>
                <p className="text-muted" style={{ marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                    Let our AI analyze your farm and give helpful advice
                </p>
                <button style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '24px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 auto'
                }}>
                    <span role="img" aria-label="leaf">🌿</span> Get My Tips Now
                </button>
            </Card>

            {/* Recent Activities */}
            <Card style={{ marginTop: '0.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <History size={16} className="text-muted" /> Recent Activities
                    </h3>
                    <a href="/transactions" style={{ fontSize: '0.8rem' }}>View All</a>
                </div>

                {recentActs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        No transactions yet. Record a sale or expense to get started!
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {recentActs.map((act, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                <div>
                                    <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{act.description || act.transaction_type}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.transaction_date}</div>
                                </div>
                                <div style={{ fontWeight: '600', color: act.transaction_type === 'sale' ? 'var(--primary-color)' : 'var(--accent-red)' }}>
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
