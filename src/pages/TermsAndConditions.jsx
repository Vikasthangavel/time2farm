import React from 'react';
import Card from '../components/Card';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
    return (
        <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'var(--bg-light)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Card style={{ maxWidth: '800px', width: '100%', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <FileText size={30} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-dark)' }}>Terms & Conditions</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Last updated: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div style={{ color: 'var(--text-dark)', lineHeight: '1.6', fontSize: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>1. Acceptance of Terms</h2>
                    <p style={{ marginBottom: '1rem' }}>By accessing and using the Time2Farm application, you accept and agree to be bound by the terms and provision of this agreement.</p>

                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>2. Description of Service</h2>
                    <p style={{ marginBottom: '1rem' }}>Time2Farm provides farmers with tools to track sales, expenses, manage farm sections, and view market prices. We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.</p>
                    
                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>3. User Registration</h2>
                    <p style={{ marginBottom: '1rem' }}>You may be required to register with the application. You agree to keep your password confidential and will be responsible for all use of your account and password.</p>

                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>4. User Data</h2>
                    <p style={{ marginBottom: '1rem' }}>You retain all rights to the data you input into the application. We do not sell your data. For more information on how we handle your data, please review our <Link to="/privacy-policy" style={{ color: 'var(--primary-color)' }}>Privacy Policy</Link>.</p>

                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>5. Limitations of Liability</h2>
                    <p style={{ marginBottom: '1rem' }}>Time2Farm will not be liable for any direct, indirect, incidental, special, or consequential damages that result from the use of, or the inability to use, the application or the materials provided.</p>

                    <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>Contact Us</h2>
                    <p style={{ marginBottom: '1rem' }}>If you have any questions about these Terms, please contact us at support@time2farm.com.</p>
                </div>
                
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>&larr; Back to Home</Link>
                </div>
            </Card>
        </div>
    );
};

export default TermsAndConditions;
