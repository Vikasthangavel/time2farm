import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { Trash2, AlertTriangle, ArrowRight } from 'lucide-react';

const DeleteAccountPublic = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;

    return (
        <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'var(--bg-light)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Card style={{ maxWidth: '500px', width: '100%', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--accent-red-light)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Trash2 size={30} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>Account Deletion</h1>
                </div>

                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    <p style={{ marginBottom: '1rem' }}>
                        In accordance with App Store and Google Play Store guidelines, you can request the complete deletion of your Time2Farm account and all associated data through this public portal.
                    </p>
                    <div>
                        <strong>What gets deleted permanently:</strong>
                        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Your profile and login information</li>
                            <li>All your farm sections and livestock data</li>
                            <li>All financial records (sales and expenses)</li>
                        </ul>
                    </div>
                </div>

                {user ? (
                    <div style={{ background: 'var(--primary-50)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--primary-100)', textAlign: 'center' }}>
                        <p style={{ marginBottom: '1rem', fontWeight: 500, color: 'var(--primary-dark)' }}>
                            You are currently logged in as <strong>@{user.username}</strong>.
                        </p>
                        <Link to="/settings" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: 'var(--accent-red)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}>
                            Proceed to Delete Account <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div style={{ background: 'var(--accent-orange-light)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)', textAlign: 'center' }}>
                        <AlertTriangle size={24} color="var(--accent-orange)" style={{ margin: '0 auto 0.5rem' }} />
                        <p style={{ marginBottom: '1rem', fontWeight: 500, color: 'var(--text-dark)' }}>
                            To verify your identity and delete your data, please log in first.
                        </p>
                        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: 'var(--primary-color)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}>
                            Log In to Continue <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default DeleteAccountPublic;
