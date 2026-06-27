import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Google Sign-In state
    const [needsProfile, setNeedsProfile] = useState(false);
    const [googleData, setGoogleData] = useState({});
    const [completionForm, setCompletionForm] = useState({ username: '', farm_name: '', phone: '' });
    const googleButtonRef = useRef(null);

    const { login, googleLogin, googleComplete } = useAuth();
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

    useEffect(() => {
        const initGoogle = () => {
            if (!needsProfile && window.google?.accounts?.id && googleButtonRef.current) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
                    callback: handleGoogleResponse
                });
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { theme: 'outline', size: 'large', text: 'signin_with', width: 280 }
                );
            } else if (!needsProfile) {
                setTimeout(initGoogle, 100);
            }
        };
        initGoogle();
    }, [needsProfile]);

    const handleGoogleResponse = async (response) => {
        setIsSubmitting(true);
        setError('');
        try {
            const res = await googleLogin(response.credential);
            if (res.success) {
                if (res.needs_profile) {
                    setGoogleData({
                        google_email: res.google_email,
                        google_name: res.google_name,
                        google_sub: res.google_sub
                    });
                    setNeedsProfile(true);
                } else {
                    navigate('/');
                }
            } else {
                setError(res.message || 'Google Sign-In failed');
            }
        } catch (err) {
            setError('Google authentication error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteProfile = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const success = await googleComplete({
                ...googleData,
                ...completionForm
            });
            if (success) {
                navigate('/');
            } else {
                setError('Failed to complete profile. Try a different username.');
            }
        } catch (err) {
            setError('Error completing profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left decorative panel — shown on desktop */}
            <div className="login-panel">
                <style>{`
                    @media (min-width: 768px) {
                        .login-panel { display: flex !important; }
                    }
                `}</style>

                {/* Decorative bubbles */}
                <div style={{ position: 'absolute', top: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ position: 'absolute', bottom: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ position: 'absolute', top: '40%', right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                <div className="login-panel-inner">
                    <div className="login-panel-logo">
                        <img src="/logo.png" alt="Time2Farm" />
                    </div>
                    <h1 className="login-panel-title">Time2Farm</h1>
                    <p className="login-panel-sub">Your smart farming companion. Track sales, manage expenses, and grow your farm's profitability.</p>

                    <div className="login-panel-features">
                        {['Real-time financial tracking', 'Multi-area farm management', 'AI-powered farming tips'].map(f => (
                            <div key={f} className="feature-item">{f}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="login-form-panel">
                <div className="login-card">
                    {/* Mobile logo */}
                    <div className="login-logo">
                        <img src="/logo.png" alt="Time2Farm" />
                        <h1 className="login-title">Welcome back</h1>
                        <p className="login-subtitle">Sign in to your Time2Farm account</p>
                    </div>

                    {error && (
                        <div className="error-box">{error}</div>
                    )}
                    
                    {needsProfile ? (
                        <form onSubmit={handleCompleteProfile} className="login-form">
                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Complete Your Profile</h3>
                            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Just a few more details to create your account.
                            </p>
                            <div className="form-group">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    value={completionForm.username}
                                    onChange={(e) => setCompletionForm({...completionForm, username: e.target.value})}
                                    placeholder="Enter username"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label>Farm Name</label>
                                <input
                                    type="text"
                                    value={completionForm.farm_name}
                                    onChange={(e) => setCompletionForm({...completionForm, farm_name: e.target.value})}
                                    placeholder="Optional"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    value={completionForm.phone}
                                    onChange={(e) => setCompletionForm({...completionForm, phone: e.target.value})}
                                    placeholder="Optional"
                                />
                            </div>
                            <Button
                                type="submit"
                                fullWidth
                                disabled={isSubmitting}
                                style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '1rem' }}
                            >
                                {isSubmitting ? 'Saving...' : 'Complete Profile'}
                            </Button>
                        </form>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
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

                                <div className="form-group">
                                    <label>Password</label>
                                    <div className="password-wrapper">
                                        <input
                                            type={showPw ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw(!showPw)}
                                            className="password-toggle"
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
                            
                            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                                <span style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>or</span>
                                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }}>
                                <div ref={googleButtonRef}></div>
                            </div>

                            <p className="register-cta">
                                Don't have an account?{' '}
                                <span onClick={() => navigate('/register')} className="register-link">Create account</span>
                            </p>
                            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                By signing in, you agree to our <Link to="/terms-and-conditions" style={{ color: 'var(--primary-color)' }}>Terms & Conditions</Link> and <Link to="/privacy-policy" style={{ color: 'var(--primary-color)' }}>Privacy Policy</Link>.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
