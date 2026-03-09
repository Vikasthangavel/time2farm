import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';
import Button from '../components/Button';
import Card from '../components/Card';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        farm_name: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            const msg = err.response?.data?.message || 'An error occurred during registration. Please try again.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ color: 'var(--primary-dark)', fontSize: '2rem', fontWeight: 'bold' }}>Time2Farm</h1>
                <p className="text-muted">Join our farming community</p>
            </div>

            <Card>
                <h2 className="text-h2" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>

                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Full Name *</label>
                            <input
                                name="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Username *</label>
                            <input
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Email Address *</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Password *</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            required
                            minLength="6"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Farm Name</label>
                            <input
                                name="farm_name"
                                type="text"
                                value={formData.farm_name}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Phone</label>
                            <input
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        style={{ marginTop: '0.5rem' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Register'}
                    </Button>
                </form>
            </Card>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                Already have an account? <span
                    onClick={() => navigate('/login')}
                    style={{ color: 'var(--primary-color)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Login Here
                </span>
            </p>
        </div>
    );
};

export default Register;
