import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { userAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { User, Save, Phone, MapPin, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    const [profile, setProfile] = useState({ full_name: '', farm_name: '', phone: '', address: '' });
    const [loading, setLoading]   = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage]   = useState({ text: '', type: '' });

    useEffect(() => {
        userAPI.getProfile().then(res => {
            if (res.success && res.user) {
                setProfile({
                    full_name: res.user.full_name || '',
                    farm_name: res.user.farm_name || '',
                    phone:     res.user.phone     || '',
                    address:   res.user.address   || '',
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

    const initial = profile.full_name?.charAt(0)?.toUpperCase()
                 || user?.username?.charAt(0)?.toUpperCase()
                 || 'F';

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '1.4rem', flexShrink: 0,
                }}>
                    {initial}
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)' }}>
                        {profile.full_name || 'Farmer'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        @{user?.username}
                    </div>
                    {profile.farm_name && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            marginTop: '4px', background: 'var(--primary-50)',
                            color: 'var(--primary-dark)', padding: '2px 8px',
                            borderRadius: '20px', fontSize: '0.73rem', fontWeight: 500,
                        }}>
                            <Building2 size={11} /> {profile.farm_name}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Edit form ── */}
            <Card>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1.25rem' }}>
                    Edit Information
                </h2>

                {/* Status message */}
                {message.text && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: message.type === 'success' ? 'var(--primary-100)' : 'var(--accent-red-light)',
                        color: message.type === 'success' ? 'var(--primary-dark)' : 'var(--accent-red)',
                        padding: '0.625rem 0.875rem', borderRadius: '8px',
                        marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 500,
                    }}>
                        {message.type === 'success'
                            ? <CheckCircle2 size={15} />
                            : <AlertCircle size={15} />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

                    {/* Full Name */}
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                            <User size={13} /> Full Name
                        </label>
                        <input
                            type="text" name="full_name"
                            value={profile.full_name} onChange={handleChange}
                            required placeholder="Your full name"
                        />
                    </div>

                    {/* Farm Name */}
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                            <Building2 size={13} /> Farm / Business Name
                        </label>
                        <input
                            type="text" name="farm_name"
                            value={profile.farm_name} onChange={handleChange}
                            placeholder="e.g. Green Valley Farm"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                            <Phone size={13} /> Phone Number
                        </label>
                        <input
                            type="tel" name="phone"
                            value={profile.phone} onChange={handleChange}
                            placeholder="+91 98765 43210"
                        />
                    </div>

                    {/* Address */}
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

                    <Button
                        type="submit"
                        fullWidth
                        disabled={isSaving}
                        style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
                    >
                        <Save size={15} /> {isSaving ? 'Saving…' : 'Save Changes'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Profile;
