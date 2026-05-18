import React, { useEffect, useState, useCallback } from 'react';
import { transactionsAPI, sectionsAPI, expensesAPI, salesAPI } from '../api/client';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import {
    History, TrendingUp, TrendingDown, ArrowLeft,
    Pencil, Trash2, X, Check, ChevronDown, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Inline Edit Modal ─────────────────────── */
const EditModal = ({ transaction, onClose, onSave }) => {
    const isSale = transaction.transaction_type === 'sale';
    const [amount, setAmount] = useState(String(transaction.amount || ''));
    const [date, setDate] = useState(transaction.transaction_date || '');
    const [notes, setNotes] = useState(transaction.description || '');
    const [buyer, setBuyer] = useState(transaction.buyer_name || '');
    const [receipt, setReceipt] = useState(transaction.receipt_number || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = isSale
                ? { amount: parseFloat(amount), sale_date: date, description: notes, buyer_name: buyer }
                : { amount: parseFloat(amount), expense_date: date, description: notes, receipt_number: receipt };
            await onSave(transaction.id, payload);
            onClose();
        } catch (err) {
            setError('Failed to update. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
        }} onClick={onClose}>
            <div
                style={{
                    background: 'white', borderRadius: '16px',
                    width: '100%', maxWidth: 420,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Modal header */}
                <div style={{
                    background: isSale
                        ? 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))'
                        : 'linear-gradient(135deg, #e8a020, #b87316)',
                    color: 'white',
                    padding: '1rem 1.25rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        {isSale ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        Edit {isSale ? 'Sale' : 'Expense'}
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                        borderRadius: '50%', width: 28, height: 28, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <X size={15} />
                    </button>
                </div>

                <form onSubmit={handleSave} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && (
                        <div style={{ background: 'var(--accent-red-light)', color: 'var(--accent-red)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', borderLeft: '3px solid var(--accent-red)' }}>
                            {error}
                        </div>
                    )}

                    <div>
                        <label>Total Amount (₹)</label>
                        <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
                    </div>

                    <div>
                        <label>Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    </div>

                    {isSale && (
                        <div>
                            <label>Buyer Name (Optional)</label>
                            <input type="text" value={buyer} onChange={e => setBuyer(e.target.value)} placeholder="e.g. Local Market" />
                        </div>
                    )}

                    {!isSale && (
                        <div>
                            <label>Receipt No (Optional)</label>
                            <input type="text" value={receipt} onChange={e => setReceipt(e.target.value)} placeholder="e.g. REC-1204" />
                        </div>
                    )}

                    <div>
                        <label>Notes (Optional)</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="2" style={{ resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                        <Button type="submit" fullWidth disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Check size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={onClose} style={{ flexShrink: 0 }}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ── Transaction Card ──────────────────────── */
const TransactionCard = ({ t, onEdit, onDelete }) => {
    const isSale = t.transaction_type === 'sale';
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <Card padding="0" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
                {/* Color accent bar */}
                <div style={{
                    width: 4, flexShrink: 0,
                    background: isSale ? 'var(--primary-color)' : 'var(--accent-orange)',
                }} />

                <div style={{ flex: 1, padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    {/* Left: icon + info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                            background: isSale ? 'var(--primary-100)' : 'var(--accent-orange-light)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isSale ? 'var(--primary-dark)' : 'var(--accent-orange)',
                        }}>
                            {isSale ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '2px' }}>
                                {t.section_name || 'Unknown Area'}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-body)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t.description || t.category || (isSale ? 'Product Sale' : 'Farm Expense')}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '8px' }}>
                                <span>{t.transaction_date}</span>
                                {t.buyer_name && <span>· Buyer: {t.buyer_name}</span>}
                                {t.quantity && <span>· {t.quantity} {t.unit}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Right: amount + actions */}
                    <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: isSale ? 'var(--primary-color)' : 'var(--accent-red)' }}>
                            {isSale ? '+' : '-'}₹{Number(t.amount).toLocaleString()}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {!confirmDelete ? (
                                <>
                                    <button
                                        onClick={() => onEdit(t)}
                                        title="Edit"
                                        style={{
                                            background: 'var(--primary-50)', border: 'none', color: 'var(--primary-dark)',
                                            borderRadius: '6px', padding: '4px 8px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 500,
                                        }}
                                    >
                                        <Pencil size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(true)}
                                        title="Delete"
                                        style={{
                                            background: 'var(--accent-red-light)', border: 'none', color: 'var(--accent-red)',
                                            borderRadius: '6px', padding: '4px 8px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 500,
                                        }}
                                    >
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-red)', alignSelf: 'center' }}>Sure?</span>
                                    <button
                                        onClick={() => onDelete(t)}
                                        style={{ background: 'var(--accent-red)', border: 'none', color: 'white', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        style={{ background: 'var(--border-color)', border: 'none', color: 'var(--text-body)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem' }}
                                    >
                                        No
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

/* ── Main Page ──────────────────────────────── */
const TransactionsHistory = () => {
    const [allTransactions, setAllTransactions] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('all');       // 'all' | 'sale' | 'expense'
    const [sectionFilter, setSectionFilter] = useState('all'); // 'all' | section.id
    const [editTarget, setEditTarget] = useState(null);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [txRes, secRes] = await Promise.all([
                transactionsAPI.getAll(),
                sectionsAPI.getSections(),
            ]);
            if (txRes.success) setAllTransactions(txRes.transactions || []);
            if (secRes.success) setSections(secRes.sections || []);
        } catch (err) {
            console.error('Failed to fetch:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* Apply filters */
    const filtered = allTransactions.filter(t => {
        const typeOk = typeFilter === 'all' || t.transaction_type === typeFilter;
        const secOk  = sectionFilter === 'all' || String(t.section_id) === String(sectionFilter);
        return typeOk && secOk;
    });

    /* Summary for active filter */
    const totalEarned = filtered.filter(t => t.transaction_type === 'sale').reduce((s, t) => s + Number(t.amount), 0);
    const totalSpent  = filtered.filter(t => t.transaction_type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

    /* Edit handler */
    const handleSave = async (id, payload) => {
        const t = allTransactions.find(x => x.id === id);
        if (t.transaction_type === 'sale') await salesAPI.updateSale(id, payload);
        else await expensesAPI.updateExpense(id, payload);
        await fetchData();
    };

    /* Delete handler */
    const handleDelete = async (t) => {
        if (t.transaction_type === 'sale') await salesAPI.deleteSale(t.id);
        else await expensesAPI.deleteExpense(t.id);
        setAllTransactions(prev => prev.filter(x => x.id !== t.id));
    };

    return (
        <div className="page-wrapper">
            {editTarget && (
                <EditModal
                    transaction={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={handleSave}
                />
            )}

            <Header />

            {/* Page title */}
            <div className="flex-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: 0 }}>
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-h1" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <History size={22} color="var(--primary-color)" /> Transaction History
                    </h1>
                </div>
            </div>

            {/* Summary mini cards */}
            {!loading && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary-50)', borderRadius: '12px', padding: '0.875rem', borderLeft: '3px solid var(--primary-color)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Income</div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>₹{totalEarned.toLocaleString()}</div>
                    </div>
                    <div style={{ background: 'var(--accent-orange-light)', borderRadius: '12px', padding: '0.875rem', borderLeft: '3px solid var(--accent-orange)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Expense</div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-orange)' }}>₹{totalSpent.toLocaleString()}</div>
                    </div>
                </div>
            )}

            {/* Section filter */}
            <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={14} /> Filter by Area
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
                    {[{ id: 'all', name: 'All Areas' }, ...sections].map(s => (
                        <button
                            key={s.id}
                            onClick={() => setSectionFilter(String(s.id))}
                            style={{
                                padding: '0.4rem 0.875rem',
                                borderRadius: '20px',
                                border: `1.5px solid ${sectionFilter === String(s.id) ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                backgroundColor: sectionFilter === String(s.id) ? 'var(--primary-color)' : 'white',
                                color: sectionFilter === String(s.id) ? 'white' : 'var(--text-body)',
                                fontSize: '0.8rem', fontWeight: 500,
                                cursor: 'pointer', whiteSpace: 'nowrap',
                                transition: 'all 0.15s',
                            }}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Type filter */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                    { key: 'all', label: 'All Records' },
                    { key: 'sale', label: 'Sales Only' },
                    { key: 'expense', label: 'Expenses Only' },
                ].map(f => (
                    <button
                        key={f.key}
                        onClick={() => setTypeFilter(f.key)}
                        style={{
                            padding: '0.4rem 0.875rem',
                            borderRadius: '20px',
                            border: `1.5px solid ${typeFilter === f.key ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            backgroundColor: typeFilter === f.key ? 'var(--primary-color)' : 'white',
                            color: typeFilter === f.key ? 'white' : 'var(--text-body)',
                            fontSize: '0.8rem', fontWeight: 500,
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Records */}
            {loading ? (
                <div className="flex-center" style={{ height: '20vh', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary-color)', animation: 'spin 0.8s linear infinite' }} />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    <span className="text-muted">Loading records...</span>
                </div>
            ) : filtered.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ width: 48, height: 48, background: 'var(--primary-100)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary-color)' }}>
                        <History size={24} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Records Found</h3>
                    <p className="text-muted">No transactions match the current filters.</p>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '4px' }}>
                        Showing {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                    </div>
                    {filtered.map((t, idx) => (
                        <TransactionCard
                            key={t.id || idx}
                            t={t}
                            onEdit={setEditTarget}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionsHistory;
