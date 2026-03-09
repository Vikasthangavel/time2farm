import React from 'react';
import { MapPin, CalendarDays, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const dateStr = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div style={{
            backgroundColor: 'var(--bg-banner)',
            padding: '1.25rem 1rem', // Reduced padding for better fit
            borderRadius: 'var(--border-radius-lg)',
            color: 'white',
            marginBottom: '1rem',
            position: 'relative',
            boxShadow: 'var(--shadow-md)'
        }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '40px' }}>
                Good Evening, {user?.full_name?.split(' ')[0] || 'Farmer'}! 👨‍🌾
            </h1>

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', opacity: 0.95, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '12px' }}>
                    {user?.farm_name || 'Vikas Farm'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '12px' }}>
                    <MapPin size={12} /> Kadachanallur
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '12px' }}>
                    <CalendarDays size={12} /> {dateStr}
                </span>
            </div>

            <button
                onClick={handleLogout}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255,255,255,0.25)',
                    border: 'none',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title="Logout"
            >
                <LogOut size={16} />
            </button>
        </div>
    );
};

export default Header;
