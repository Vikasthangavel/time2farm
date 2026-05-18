import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';
import Button from '../components/Button';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', email: '', password: '',
        full_name: '', farm_name: '', phone: '', address: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const Field = ({ label, name, type = 'text', required, minLength, placeholder }) => (
        <div>
            <label>{label}{required && ' *'}</label>
            <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                minLength={minLength}
                placeholder={placeholder}
            />
        </div>
    );

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

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Two-column row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Field label="Full Name"  name="full_name" required placeholder="John Doe" />
                            <Field label="Username"   name="username"  required placeholder="johndoe" />
                        </div>

                        <Field label="Email Address" name="email"    type="email"    required placeholder="john@example.com" />
                        <Field label="Password"      name="password" type="password" required minLength={6} placeholder="Min. 6 characters" />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Field label="Farm Name" name="farm_name" placeholder="My Green Farm" />
                            <Field label="Phone"     name="phone"     type="tel"    placeholder="+91 98765 43210" />
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
