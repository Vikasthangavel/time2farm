import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Sprout, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const success = await login(username, password);
            if (success) {
                navigate('/');
            } else {
                setError('Invalid username or password. Please try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'stretch',
            backgroundColor: 'var(--bg-main)',
        }}>
            {/* Left decorative panel — shown on desktop */}
            <div style={{
                flex: '0 0 45%',
                background: 'linear-gradient(160deg, #16a34a 0%, #15803d 50%, #166534 100%)',
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '3rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }} className="login-panel">
                <style>{`
                    @media (min-width: 768px) {
                        .login-panel { display: flex !important; }
                    }
                `}</style>

                {/* Decorative bubbles */}
                <div style={{ position: 'absolute', top: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ position: 'absolute', bottom: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ position: 'absolute', top: '40%', right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 320 }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: '20px',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        backdropFilter: 'blur(8px)',
                    }}>
                        <Sprout size={36} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'white' }}>
                        Time2Farm
                    </h1>
                    <p style={{ fontSize: '1rem', opacity: 0.85, lineHeight: 1.7 }}>
                        Your smart farming companion. Track sales, manage expenses, and grow your farm's profitability.
                    </p>

                    <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['📊 Real-time financial tracking', '🌿 Multi-area farm management', '🤖 AI-powered farming tips'].map(f => (
                            <div key={f} style={{
                                background: 'rgba(255,255,255,0.12)',
                                borderRadius: '12px',
                                padding: '0.75rem 1rem',
                                fontSize: '0.875rem',
                                textAlign: 'left',
                                backdropFilter: 'blur(4px)',
                            }}>{f}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 'clamp(1.5rem, 5vw, 3rem)',
            }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    {/* Mobile logo */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: '14px',
                            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 0.75rem',
                        }}>
                            <Sprout size={26} color="white" />
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                            Welcome back
                        </h1>
                        <p className="text-muted" style={{ marginTop: '0.25rem' }}>
                            Sign in to your Time2Farm account
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            backgroundColor: 'var(--accent-red-light)',
                            color: '#b91c1c',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--border-radius)',
                            marginBottom: '1.25rem',
                            fontSize: '0.875rem',
                            borderLeft: '3px solid var(--accent-red)',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div>
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    style={{
                                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', color: 'var(--text-muted)',
                                        cursor: 'pointer', padding: 4,
                                    }}
                                >
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            disabled={isSubmitting}
                            style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '1rem' }}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <span
                            onClick={() => navigate('/register')}
                            style={{ color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Create account
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
