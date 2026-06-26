import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { userAPI, transactionsAPI, sectionsAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
    User, Save, Phone, MapPin, Building2, Calendar,
    CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Layers, DollarSign, Trash2
} from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    const [profile, setProfile] = useState({ full_name: '', farm_name: '', phone: '', address: '', records_from_date: '' });
    const [stats, setStats]     = useState({ sales: 0, expenses: 0, sections: 0, income: 0, expense: 0 });
    const [loading, setLoading]   = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage]   = useState({ text: '', type: '' });

    useEffect(() => {
        Promise.all([
            userAPI.getProfile(),
            transactionsAPI.getAll(),
            sectionsAPI.getSections(),
        ]).then(([profRes, txRes, secRes]) => {
            if (profRes.success && profRes.user) {
                setProfile({
                    full_name: profRes.user.full_name || '',
                    farm_name: profRes.user.farm_name || '',
                    phone:     profRes.user.phone     || '',
                    address:   profRes.user.address   || '',
                    records_from_date: profRes.user.records_from_date || '',
                });
            }
            if (txRes.success) {
                const txs      = txRes.transactions || [];
                const sales    = txs.filter(t => t.transaction_type === 'sale');
                const expenses = txs.filter(t => t.transaction_type === 'expense');
                setStats({
                    sales:    sales.length,
                    expenses: expenses.length,
                    sections: secRes.success ? (secRes.sections || []).length : 0,
                    income:   sales.reduce((s, t) => s + Number(t.amount), 0),
                    expense:  expenses.reduce((s, t) => s + Number(t.amount), 0),
                });
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleChange = e => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await userAPI.updateProfile(profile);
            setMessage({
                text: res.success ? 'Profile saved!' : (res.message || 'Update failed.'),
                type: res.success ? 'success' : 'error',
            });
        } catch {
            setMessage({ text: 'An error occurred.', type: 'error' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 3500);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }
        setIsDeleting(true);
        try {
            const res = await userAPI.deleteAccount();
            if (res.success) {
                localStorage.removeItem('time2farm.auth.token');
                window.location.href = '/';
            } else {
                setMessage({ text: res.message || 'Failed to delete account.', type: 'error' });
                setIsDeleting(false);
            }
        } catch {
            setMessage({ text: 'An error occurred while deleting account.', type: 'error' });
            setIsDeleting(false);
        }
    };

    const initial = profile.full_name?.charAt(0)?.toUpperCase()
                 || user?.username?.charAt(0)?.toUpperCase()
                 || 'F';
    const net = stats.income - stats.expense;

    if (loading) return (
        <div className="flex-center" style={{ height: '50vh', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary-color)', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <span className="text-muted">Loading…</span>
        </div>
    );

    return (
        <div className="page-wrapper">

            {/* ── Avatar + name ── */}
            <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Avatar */}
                    <div style={{
                        width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '1.4rem',
                    }}>
                        {initial}
                    </div>

                    {/* Name / username / farm */}
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {profile.full_name || 'Farmer'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            @{user?.username}
                        </div>
                        {profile.farm_name && (
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                marginTop: '4px', background: 'var(--primary-50)',
                                color: 'var(--primary-dark)', padding: '2px 8px',
                                borderRadius: '20px', fontSize: '0.72rem', fontWeight: 500,
                            }}>
                                <Building2 size={11} /> {profile.farm_name}
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* ── Summary stats ── */}
            <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                    Farm Summary
                </p>

                {/* 3 count pills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {[
                        { icon: Layers,      label: 'Areas',    value: stats.sections, color: '#8b5cf6' },
                        { icon: TrendingUp,  label: 'Sales',    value: stats.sales,    color: 'var(--primary-color)' },
                        { icon: TrendingDown,label: 'Expenses', value: stats.expenses, color: 'var(--accent-orange)' },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            padding: '0.625rem 0.5rem',
                            textAlign: 'center',
                        }}>
                            <Icon size={16} color={color} style={{ marginBottom: '4px' }} />
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>{value}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Income / Net row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div style={{ background: 'var(--primary-50)', borderRadius: '10px', padding: '0.75rem', borderLeft: '3px solid var(--primary-color)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>Total Income</div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-dark)' }}>₹{stats.income.toLocaleString()}</div>
                    </div>
                    <div style={{
                        background: net >= 0 ? 'var(--primary-50)' : 'var(--accent-red-light)',
                        borderRadius: '10px', padding: '0.75rem',
                        borderLeft: `3px solid ${net >= 0 ? 'var(--primary-color)' : 'var(--accent-red)'}`,
                    }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <DollarSign size={11} /> Net Profit
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: net >= 0 ? 'var(--primary-dark)' : 'var(--accent-red)' }}>
                            {net >= 0 ? '+' : ''}₹{net.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Edit form ── */}
            <Card>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1.1rem' }}>
                    Edit Information
                </h2>

                {message.text && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: message.type === 'success' ? 'var(--primary-100)' : 'var(--accent-red-light)',
                        color: message.type === 'success' ? 'var(--primary-dark)' : 'var(--accent-red)',
                        padding: '0.6rem 0.875rem', borderRadius: '8px',
                        marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 500,
                    }}>
                        {message.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {[
                        { name: 'full_name', label: 'Full Name',            icon: User,      type: 'text', placeholder: 'Your full name',         required: true },
                        { name: 'farm_name', label: 'Farm / Business Name', icon: Building2, type: 'text', placeholder: 'e.g. Green Valley Farm'              },
                        { name: 'phone',     label: 'Phone Number',         icon: Phone,     type: 'tel',  placeholder: '+91 98765 43210'                      },
                    ].map(({ name, label, icon: Icon, type, placeholder, required }) => (
                        <div key={name}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                                <Icon size={13} /> {label}
                            </label>
                            <input
                                type={type} name={name}
                                value={profile[name]} onChange={handleChange}
                                placeholder={placeholder} required={required}
                            />
                        </div>
                    ))}

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                            <MapPin size={13} /> Address
                        </label>
                        <textarea
                            name="address" rows="2"
                            value={profile.address} onChange={handleChange}
                            placeholder="Village, District, State"
                            style={{ resize: 'none' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                            <Calendar size={13} /> Records From
                        </label>
                        <input
                            type="date"
                            name="records_from_date"
                            value={profile.records_from_date}
                            onChange={handleChange}
                            placeholder="Show records from this date"
                        />
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                            Only sales, expenses, summaries, and reports on or after this date will show.
                        </div>
                    </div>

                    <Button
                        type="submit" fullWidth disabled={isSaving}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
                    >
                        <Save size={15} /> {isSaving ? 'Saving…' : 'Save Changes'}
                    </Button>
                </form>
            </Card>

            {/* ── Delete Account ── */}
            <Card style={{ marginTop: '1.5rem', border: '1px solid var(--accent-red-light)' }}>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-red)', marginBottom: '0.5rem' }}>
                    Danger Zone
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    style={{ 
                        background: 'var(--accent-red)', 
                        color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' 
                    }}
                >
                    <Trash2 size={15} /> {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
            </Card>
        </div>
    );
};

export default Profile;
