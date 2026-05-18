import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { FileText, Download, TrendingUp, Filter, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const navigate = useNavigate();

    const handleGenerateReport = () => {
        navigate('/reports/download');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="flex-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'var(--text-dark)' }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-h1" style={{ margin: 0 }}>Farm Reports</h1>
                </div>
            </div>

            <Card style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                color: 'white',
                padding: '2rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        padding: '1rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FileText size={48} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Professional Farm Report</h2>
                        <p style={{ opacity: 0.9, fontSize: '0.9rem', maxWidth: '300px' }}>
                            Get a comprehensive PDF analysis of your farm's financial health, section performance, and transaction history.
                        </p>
                    </div>

                    <Button
                        onClick={handleGenerateReport}
                        style={{
                            backgroundColor: 'white',
                            color: 'var(--primary-dark)',
                            padding: '0.875rem 2rem',
                            borderRadius: '30px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginTop: '0.5rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        <>
                            <Download size={20} />
                            Download PDF Report
                        </>
                    </Button>
                </div>
            </Card>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '0.5rem' }}>What's included in your report?</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Card padding="1rem" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <TrendingUp size={24} color="var(--primary-color)" />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>Financial Summary</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Detailed breakdown of total revenue, expenses, and net profit.</p>
                </Card>

                <Card padding="1rem" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Filter size={24} color="var(--primary-color)" />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>Section Analysis</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Performance metrics for each section of your farm.</p>
                </Card>

                <Card padding="1rem" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Calendar size={24} color="var(--primary-color)" />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>History</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chronological record of recent sales and expenses.</p>
                </Card>

                <Card padding="1rem" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <TrendingUp size={24} color="var(--primary-color)" />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>AI Insights</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Smart recommendations based on your farm's performance.</p>
                </Card>
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--border-radius)',
                border: '1px dashed var(--border-color)',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Need more specific reports? Ask <b>FarmThozhan</b> in the chat widget!
                </p>
            </div>
        </div>
    );
};

export default Reports;
