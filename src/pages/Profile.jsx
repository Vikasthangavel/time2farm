import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { userAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { User, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, login } = useAuth(); // We might use login/auth context for refresh if needed, but userAPI provides current DB
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        full_name: '',
        farm_name: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await userAPI.getProfile();
                if (res.success && res.user) {
                    setProfile({
                        full_name: res.user.full_name || '',
                        farm_name: res.user.farm_name || '',
                        phone: res.user.phone || '',
                        address: res.user.address || ''
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        try {
            const res = await userAPI.updateProfile(profile);
            if (res.success) {
                setMessage('Profile updated successfully!');
                // Ideally update global AuthContext user here if it caches full_name or farm_name
            } else {
                setMessage(res.message || 'Failed to update profile.');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'An error occurred while saving.';
            setMessage(msg);
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000); // Clear message
        }
    };

    if (loading) return <div className="flex-center" style={{ height: '50vh' }}>Loading Profile...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
            <Header />

            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: 0 }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <User size={24} color="var(--primary-color)" /> Profile
                    </h2>
                </div>
            </div>

            <Card>
                {message && (
                    <div style={{
                        backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2',
                        color: message.includes('success') ? '#15803d' : '#b91c1c',
                        padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem'
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Full Name</label>
                        <input
                            type="text" name="full_name" value={profile.full_name} onChange={handleChange} required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Farm/Business Name</label>
                        <input
                            type="text" name="farm_name" value={profile.farm_name} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Phone Number</label>
                        <input
                            type="tel" name="phone" value={profile.phone} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Address</label>
                        <textarea
                            name="address" value={profile.address} onChange={handleChange} rows="3"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                        />
                    </div>

                    <Button type="submit" fullWidth disabled={isSaving} style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                        <Save size={18} /> {isSaving ? 'Saving...' : 'Update Profile'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Profile;
