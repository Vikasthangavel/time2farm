import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsAPI } from '../api/client';

const ReportDownload = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Preparing your report...');

    useEffect(() => {
        let active = true;

        const runDownload = async () => {
            try {
                setStatus('Generating PDF report...');
                await reportsAPI.generateReport();
                if (active) {
                    setStatus('Report downloaded successfully.');
                    setTimeout(() => navigate('/reports', { replace: true }), 1200);
                }
            } catch (error) {
                console.error('Failed to generate report', error);
                if (active) {
                    setStatus('Unable to generate the report. Returning to Reports...');
                    setTimeout(() => navigate('/reports', { replace: true }), 1800);
                }
            }
        };

        runDownload();

        return () => {
            active = false;
        };
    }, [navigate]);

    return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            textAlign: 'center',
            padding: '2rem 1rem',
        }}>
            <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                border: '4px solid var(--primary-100)',
                borderTopColor: 'var(--primary-color)',
                animation: 'spin 0.85s linear infinite',
            }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div>
                <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Downloading Report</h1>
                <p className="text-muted" style={{ maxWidth: 320, margin: '0 auto' }}>{status}</p>
            </div>
        </div>
    );
};

export default ReportDownload;