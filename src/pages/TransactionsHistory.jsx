import React, { useEffect, useState } from 'react';
import { transactionsAPI } from '../api/client';
import Header from '../components/Header';
import Card from '../components/Card';
import { History, TrendingUp, TrendingDown, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransactionsHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'sale', 'expense'

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await transactionsAPI.getAll();
                if (res.success) setTransactions(res.transactions || []);
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filtered = transactions.filter(t => filter === 'all' || t.transaction_type === filter);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
            <Header />

            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: 0 }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <History size={24} color="var(--primary-color)" /> Transaction History
                    </h2>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {['all', 'sale', 'expense'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: `1px solid ${filter === f ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            backgroundColor: filter === f ? 'var(--primary-color)' : 'white',
                            color: filter === f ? 'white' : 'var(--text-dark)',
                            textTransform: 'capitalize',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                        }}
                    >
                        {f === 'all' ? 'All Records' : f + 's'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex-center" style={{ height: '20vh' }}>Loading...</div>
            ) : filtered.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <History size={48} style={{ opacity: 0.5, margin: '0 auto' }} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>No Records Found</h3>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>You haven't recorded any matching transactions.</p>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filtered.map((t, idx) => {
                        const isSale = t.transaction_type === 'sale';
                        return (
                            <Card key={idx} padding="1rem" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        backgroundColor: isSale ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: isSale ? 'var(--primary-color)' : 'var(--accent-red)',
                                        padding: '0.5rem', borderRadius: '50%'
                                    }}>
                                        {isSale ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '1rem' }}>{t.section_name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-dark)' }}>{t.description || t.category || isSale ? 'Product Sale' : 'Expense'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.transaction_date}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: isSale ? 'var(--primary-color)' : 'var(--accent-red)' }}>
                                        {isSale ? '+' : '-'}₹{t.amount}
                                    </div>
                                    {t.quantity && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {t.quantity} {t.unit}</div>}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TransactionsHistory;
