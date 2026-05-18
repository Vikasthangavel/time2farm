import React from 'react';
import { MapPin, CalendarDays, LogOut, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const greetingByTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const dateStr = new Date().toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
        <div style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 60%, #166534 100%)',
            borderRadius: 'var(--border-radius-xl)',
            color: 'white',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(22,163,74,0.25)',
        }}>
            {/* Decorative circles */}
            <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 140, height: 140,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -20, right: 60,
                width: 80, height: 80,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                pointerEvents: 'none',
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, paddingRight: '2.5rem' }}>
                        <p style={{
                            fontSize: '0.8rem',
                            opacity: 0.8,
                            fontWeight: 400,
                            marginBottom: '0.2rem',
                            letterSpacing: '0.02em',
                        }}>
                            {greetingByTime()},
                        </p>
                        <h1 style={{
                            fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            marginBottom: '1rem',
                        }}>
                            {user?.full_name?.split(' ')[0] || 'Farmer'}
                        </h1>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                background: 'rgba(255,255,255,0.18)',
                                backdropFilter: 'blur(4px)',
                                padding: '4px 10px', borderRadius: '20px',
                                fontSize: '0.78rem', fontWeight: 500,
                            }}>
                                <Sprout size={12} /> {user?.farm_name || 'My Farm'}
                            </span>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                background: 'rgba(255,255,255,0.18)',
                                backdropFilter: 'blur(4px)',
                                padding: '4px 10px', borderRadius: '20px',
                                fontSize: '0.78rem', fontWeight: 500,
                            }}>
                                <MapPin size={12} /> {user?.location || 'Kadachanallur'}
                            </span>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                background: 'rgba(255,255,255,0.18)',
                                backdropFilter: 'blur(4px)',
                                padding: '4px 10px', borderRadius: '20px',
                                fontSize: '0.78rem', fontWeight: 500,
                            }}>
                                <CalendarDays size={12} /> {dateStr}
                            </span>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        style={{
                            position: 'absolute', top: 0, right: 0,
                            background: 'rgba(255,255,255,0.2)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36, height: 36,
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
