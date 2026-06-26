import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/client';
import Button from '../components/Button';

// Defined OUTSIDE Register so React doesn't treat it as a new component on every render.
// If defined inside, every keystroke re-mounts the input and focus is lost.
const Field = ({ label, name, type = 'text', required, minLength, placeholder, value, onChange }) => (
    <div>
        <label>{label}{required && ' *'}</label>
        <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            minLength={minLength}
            placeholder={placeholder}
        />
    </div>
);

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', email: '', password: '',
        full_name: '', farm_name: '', phone: '', address: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Google Sign-In state
    const [needsProfile, setNeedsProfile] = useState(false);
    const [googleData, setGoogleData] = useState({});
    const [completionForm, setCompletionForm] = useState({ username: '', farm_name: '', phone: '' });
    const googleButtonRef = useRef(null);

    const { googleLogin, googleComplete } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const response = await authAPI.register(formData);
            if (response.success) {
                navigate('/login', { state: { message: 'Registration successful! Please login.' } });
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
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
                    { theme: 'outline', size: 'large', text: 'signup_with', width: 280 }
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
                    navigate('/'); // if existing user, just log them in and redirect
                }
            } else {
                setError(res.message || 'Google Sign-Up failed');
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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'stretch',
            backgroundColor: 'var(--bg-main)',
        }}>
            {/* Left panel (desktop only) */}
            <div style={{
                flex: '0 0 38%',
                background: 'linear-gradient(160deg, #4a9e3f 0%, #2d6a27 50%, #1e4d1b 100%)',
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '3rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }} className="register-panel">
                <style>{`@media (min-width: 768px) { .register-panel { display: flex !important; } }`}</style>

                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <img src="/logo.png" alt="Time2Farm" style={{ width: 72, height: 72, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>
                        Time2Farm
                    </h1>
                    <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: '0.95rem' }}>
                        Join thousands of farmers managing their farms smarter with AI-powered insights.
                    </p>
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
                overflowY: 'auto',
            }}>
                <div style={{ width: '100%', maxWidth: 480 }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <img src="/logo.png" alt="Time2Farm" style={{ width: 52, height: 52, objectFit: 'contain', margin: '0 auto 0.75rem', display: 'block' }} />
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                            Create your account
                        </h1>
                        <p className="text-muted" style={{ marginTop: '0.25rem' }}>
                            Start managing your farm smarter
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

                    {needsProfile ? (
                        <form onSubmit={handleCompleteProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Complete Your Profile</h3>
                            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Just a few more details to create your account.
                            </p>
                            <div className="form-group" style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Username *</label>
                                <input
                                    type="text"
                                    value={completionForm.username}
                                    onChange={(e) => setCompletionForm({...completionForm, username: e.target.value})}
                                    placeholder="Enter username"
                                    required
                                    autoFocus
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                />
                            </div>
                            <div className="form-group" style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Farm Name</label>
                                <input
                                    type="text"
                                    value={completionForm.farm_name}
                                    onChange={(e) => setCompletionForm({...completionForm, farm_name: e.target.value})}
                                    placeholder="Optional"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                                />
                            </div>
                            <div className="form-group" style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Phone</label>
                                <input
                                    type="text"
                                    value={completionForm.phone}
                                    onChange={(e) => setCompletionForm({...completionForm, phone: e.target.value})}
                                    placeholder="Optional"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}
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
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Two-column row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <Field label="Full Name"  name="full_name" required placeholder="John Doe"   value={formData.full_name} onChange={handleChange} />
                                    <Field label="Username"   name="username"  required placeholder="johndoe"     value={formData.username}  onChange={handleChange} />
                                </div>

                                <Field label="Email Address" name="email"    type="email"    required placeholder="john@example.com"   value={formData.email}    onChange={handleChange} />
                                <Field label="Password"      name="password" type="password" required minLength={6} placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <Field label="Farm Name" name="farm_name" placeholder="My Green Farm"     value={formData.farm_name} onChange={handleChange} />
                                    <Field label="Phone"     name="phone"     type="tel" placeholder="+91 98765 43210" value={formData.phone}     onChange={handleChange} />
                                </div>

                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={isSubmitting}
                                    style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '1rem' }}
                                >
                                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
                        </>
                    )}

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            style={{ color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Sign in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
