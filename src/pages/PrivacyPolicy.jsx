import React from 'react';
import Card from '../components/Card';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'var(--bg-light)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Card style={{ maxWidth: '800px', width: '100%', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Shield size={30} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-dark)' }}>Privacy Policy</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Last updated: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div style={{ color: 'var(--text-dark)', lineHeight: '1.6', fontSize: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>1. Introduction</h2>
                    <p style={{ marginBottom: '1rem' }}>Welcome to Time2Farm. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our application and tell you about your privacy rights and how the law protects you.</p>

                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>2. Data We Collect</h2>
                    <p style={{ marginBottom: '1rem' }}>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li><strong>Identity Data:</strong> username, farm details.</li>
                        <li><strong>Financial Data:</strong> records of sales, expenses, and transaction history.</li>
                        <li><strong>Contact Data:</strong> email address or phone number (if provided).</li>
                    </ul>

                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>3. How We Use Your Data</h2>
                    <p style={{ marginBottom: '1rem' }}>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide and improve the Time2Farm platform, manage your account, and provide you with relevant agricultural insights.</p>
                    
                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>4. Data Security</h2>
                    <p style={{ marginBottom: '1rem' }}>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.</p>

                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>5. Your Legal Rights</h2>
                    <p style={{ marginBottom: '1rem' }}>You have the right to request access, correction, or deletion of your personal data. You can delete your account and associated data directly from the <Link to="/delete-account" style={{ color: 'var(--primary-color)' }}>Account Deletion</Link> page.</p>
                    
                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>Contact Us</h2>
                    <p style={{ marginBottom: '1rem' }}>If you have any questions about this privacy policy or our privacy practices, please contact us at support@time2farm.com.</p>
                </div>
                
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>&larr; Back to Home</Link>
                </div>
            </Card>
        </div>
    );
};

export default PrivacyPolicy;
