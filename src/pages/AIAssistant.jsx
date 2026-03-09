import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { aiAPI } from '../api/client';
import { Bot, BookOpen, Lightbulb, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIAssistant = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await aiAPI.getSummary();
                if (res.success) setSummary(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
            <Header />

            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: 0 }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <Bot size={24} color="var(--primary-color)" /> AI Assistant
                    </h2>
                </div>
            </div>

            <Card style={{ textAlign: 'center', padding: '2rem 1rem', background: 'linear-gradient(to right bottom, #e8f5e9, #c8e6c9)' }}>
                <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <Bot size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Meet FarmThozhan</h3>
                <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Your personal AI agricultural and financial advisor.</p>
                <p style={{ fontSize: '0.875rem' }}>Use the floating button <Bot size={14} style={{ verticalAlign: 'middle' }} /> in the bottom right corner of any page to chat with me anytime!</p>
            </Card>

            {loading ? (
                <Card><div className="flex-center">Analyzing your farm data...</div></Card>
            ) : summary?.summary ? (
                <Card>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={18} color="var(--accent-orange)" /> Financial Summary
                    </h3>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: summary.summary }} />

                    {summary.insights && summary.insights.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Lightbulb size={16} color="var(--accent-orange)" /> Actionable Insights
                            </h4>
                            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                                {summary.insights.map((insight, idx) => (
                                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{insight}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>
            ) : null}
        </div>
    );
};

export default AIAssistant;
