import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sectionsAPI, expensesAPI, salesAPI } from '../api/client';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, PlusCircle, TrendingDown, TrendingUp } from 'lucide-react';

const TransactionForm = ({ defaultType = 'expense' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const typeFromPath = location.pathname.includes('sale') ? 'sale' : 'expense';
    const type = defaultType || typeFromPath;
    const isSale = type === 'sale';

    const [sections, setSections] = useState([]);
    const [sectionId, setSectionId] = useState('');
    const [categories, setCategories] = useState([]);
    const [loadingConfig, setLoadingConfig] = useState(false);

    // Form State
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('kg');
    const [buyer, setBuyer] = useState('');
    const [receipt, setReceipt] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const init = async () => {
            const res = await sectionsAPI.getSections();
            if (res.success && res.sections?.length > 0) {
                setSections(res.sections);
                setSectionId(res.sections[0].id); // default select first
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!sectionId) return;
        const fetchCategories = async () => {
            setLoadingConfig(true);
            try {
                if (isSale) {
                    const res = await sectionsAPI.getSellTypes(sectionId);
                    setCategories(res.sell_types || []);
                } else {
                    const res = await sectionsAPI.getExpenseTypes(sectionId);
                    setCategories(res.expense_types || []);
                }
                setCategoryId(''); // reset category on section change
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingConfig(false);
            }
        };
        fetchCategories();
    }, [sectionId, isSale]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (isSale) {
                const q = quantity ? parseFloat(quantity) : 1;
                const payload = {
                    sell_type_id: categoryId,
                    quantity: q,
                    price_per_unit: parseFloat(amount) / q,
                    description: notes || '',
                    sale_date: date,
                    buyer_name: buyer,
                    unit: unit
                };
                const res = await salesAPI.addSale(sectionId, payload);
                if (res.success) navigate('/transactions');
                else setError(res.message);
            } else {
                const payload = {
                    expense_type_id: categoryId,
                    amount: parseFloat(amount),
                    receipt_number: receipt,
                    expense_date: date,
                    description: notes || ''
                };
                const res = await expensesAPI.addExpense(sectionId, payload);
                if (res.success) navigate('/transactions');
                else setError(res.message);
            }
        } catch (err) {
            setError("An error occurred. Please verify your inputs.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isSale ? <TrendingUp color="var(--primary-color)" /> : <TrendingDown color="var(--accent-red)" />}
                    {isSale ? 'Record Sale' : 'Add Expense'}
                </h2>
            </div>

            {sections.length === 0 ? (
                <Card style={{ textAlign: 'center' }}>
                    <p className="text-muted">You need to create a farm Area (Section) before adding transactions.</p>
                    <Button onClick={() => navigate('/sections')} style={{ marginTop: '1rem' }}>Create Area</Button>
                </Card>
            ) : (
                <Card>
                    {error && <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Common Fields */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Select Area</label>
                            <select
                                value={sectionId} onChange={e => setSectionId(e.target.value)} required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                            >
                                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Date</label>
                            <input
                                type="date" value={date} onChange={e => setDate(e.target.value)} required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>
                                {isSale ? 'Category / Product' : 'Expense Category'}
                            </label>
                            <select
                                value={categoryId} onChange={e => setCategoryId(e.target.value)} required disabled={loadingConfig}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                            >
                                <option value="" disabled>{loadingConfig ? 'Loading...' : 'Select a category...'}</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Total Amount (₹)</label>
                            <input
                                type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="e.g. 5000"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: '600' }}
                            />
                        </div>

                        {/* Sale specific fields */}
                        {isSale && (
                            <>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 2 }}>
                                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Quantity (Optional)</label>
                                        <input type="number" step="0.1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 50" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Unit</label>
                                        <select value={unit} onChange={e => setUnit(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                                            <option value="kg">kg</option>
                                            <option value="liters">liters</option>
                                            <option value="units">units</option>
                                            <option value="tons">tons</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Buyer Name (Optional)</label>
                                    <input type="text" value={buyer} onChange={e => setBuyer(e.target.value)} placeholder="e.g. Local Market" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                </div>
                            </>
                        )}

                        {/* Expense specific fields */}
                        {!isSale && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Receipt No (Optional)</label>
                                <input type="text" value={receipt} onChange={e => setReceipt(e.target.value)} placeholder="e.g. REC-1204" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Notes (Optional)</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="2" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }} />
                        </div>

                        <Button type="submit" fullWidth disabled={isSubmitting || loadingConfig || categories.length === 0} style={{ marginTop: '1rem' }} variant={isSale ? 'primary' : 'danger'}>
                            {isSubmitting ? 'Saving...' : `Save ${isSale ? 'Sale' : 'Expense'}`}
                        </Button>

                        {categories.length === 0 && !loadingConfig && sectionId && (
                            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--accent-red)' }}>
                                Please create a {isSale ? 'Sell Category' : 'Expense Category'} for this Area before adding transactions.
                            </p>
                        )}
                    </form>
                </Card>
            )}
        </div>
    );
};

export default TransactionForm;
