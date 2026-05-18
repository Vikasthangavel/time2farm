import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { userAPI, transactionsAPI, sectionsAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
    User, Save, Phone, MapPin, Building2,
    TrendingUp, TrendingDown, Layers, ArrowLeft,
    CheckCircle2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Small stat badge ─────── */
const Stat = ({ icon: Icon, label, value, color }) => (
    <div style={{
        flex: '1 1 120px',
        background: 'var(--bg-main)',
        borderRadius: '12px',
        padding: '0.875rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        border: '1px solid var(--border-color)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color }}>
            <Icon size={16} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-dark)' }}>{value}</div>
    </div>
);

/* ── Field component ─────── */
const Field = ({ label, icon: Icon, children }) => (
    <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
            {Icon && <Icon size={14} />} {label}
        </label>
        {children}
    </div>
);

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({ full_name: '', farm_name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [stats, setStats] = useState({ sales: 0, expenses: 0, sections: 0, totalIncome: 0, totalExpense: 0 });

    useEffect(() => {
        const init = async () => {
            try {
                const [profRes, txRes, secRes] = await Promise.all([
                    userAPI.getProfile(),
                    transactionsAPI.getAll(),
                    sectionsAPI.getSections(),
                ]);

                if (profRes.success && profRes.user) {
                    setProfile({
                        full_name: profRes.user.full_name || '',
                        farm_name: profRes.user.farm_name || '',
                        phone: profRes.user.phone || '',
                        address: profRes.user.address || '',
                    });
                }

                if (txRes.success) {
                    const txs = txRes.transactions || [];
                    const sales = txs.filter(t => t.transaction_type === 'sale');
                    const expenses = txs.filter(t => t.transaction_type === 'expense');
                    setStats({
                        sales: sales.length,
                        expenses: expenses.length,
                        sections: secRes.success ? (secRes.sections || []).length : 0,
                        totalIncome: sales.reduce((s, t) => s + Number(t.amount), 0),
                        totalExpense: expenses.reduce((s, t) => s + Number(t.amount), 0),
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleChange = (e) => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await userAPI.updateProfile(profile);
            if (res.success) {
                setMessage({ text: 'Profile updated successfully!', type: 'success' });
            } else {
                setMessage({ text: res.message || 'Failed to update profile.', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'An error occurred.', type: 'error' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        }
    };

    if (loading) return (
        <div className="flex-center" style={{ height: '50vh', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary-color)', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <span className="text-muted">Loading profile...</span>
        </div>
    );

    const net = stats.totalIncome - stats.totalExpense;

    return (
        <div className="page-wrapper">
            <Header />

            {/* Page title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: 0 }}>
                    <ArrowLeft size={22} />
                </button>
                <h1 className="text-h1" style={{ margin: 0 }}>My Profile</h1>
            </div>

            {/* Avatar + identity */}
            <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '1.5rem', flexShrink: 0,
                    }}>
                        {profile.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'F'}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{profile.full_name || 'Farmer'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{user?.username}</div>
                        {profile.farm_name && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', background: 'var(--primary-50)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500 }}>
                                <Building2 size={11} /> {profile.farm_name}
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Stats */}
            <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>
                    Farm Overview
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                    <Stat icon={Layers}      label="Areas"    value={stats.sections}    color="var(--primary-color)" />
                    <Stat icon={TrendingUp}  label="Sales"    value={stats.sales}       color="var(--primary-color)" />
                    <Stat icon={TrendingDown}label="Expenses" value={stats.expenses}    color="var(--accent-red)" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginTop: '0.625rem' }}>
                    <div style={{ background: 'var(--primary-50)', borderRadius: '12px', padding: '0.875rem', borderLeft: '3px solid var(--primary-color)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Total Income</div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>₹{stats.totalIncome.toLocaleString()}</div>
                    </div>
                    <div style={{ background: net >= 0 ? 'var(--primary-50)' : 'var(--accent-red-light)', borderRadius: '12px', padding: '0.875rem', borderLeft: `3px solid ${net >= 0 ? 'var(--primary-color)' : 'var(--accent-red)'}` }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Net Profit</div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: net >= 0 ? 'var(--primary-dark)' : 'var(--accent-red)' }}>{net >= 0 ? '+' : ''}₹{net.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Edit form */}
            <Card style={{ borderTop: '3px solid var(--primary-color)' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} color="var(--primary-color)" /> Edit Information
                </h2>

                {message.text && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: message.type === 'success' ? 'var(--primary-100)' : 'var(--accent-red-light)',
                        color: message.type === 'success' ? 'var(--primary-dark)' : 'var(--accent-red)',
                        padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem',
                        fontSize: '0.875rem', fontWeight: 500,
                    }}>
                        {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Field label="Full Name" icon={User}>
                        <input type="text" name="full_name" value={profile.full_name} onChange={handleChange} required placeholder="Your full name" />
                    </Field>

                    <Field label="Farm / Business Name" icon={Building2}>
                        <input type="text" name="farm_name" value={profile.farm_name} onChange={handleChange} placeholder="e.g. Green Valley Farm" />
                    </Field>

                    <Field label="Phone Number" icon={Phone}>
                        <input type="tel" name="phone" value={profile.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                    </Field>

                    <Field label="Address" icon={MapPin}>
                        <textarea name="address" value={profile.address} onChange={handleChange} rows="3" placeholder="Village, District, State" style={{ resize: 'vertical' }} />
                    </Field>

                    <Button type="submit" fullWidth disabled={isSaving} style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Update Profile'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Profile;
