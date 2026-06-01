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
    const [showSectionPicker, setShowSectionPicker] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingConfig, setLoadingConfig] = useState(false);
    const selectedSection = sections.find(s => String(s.id) === String(sectionId));

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
    const selectedCategory = categories.find(c => String(c.id) === String(categoryId));

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
        if (!categoryId) {
            setError(`Please select a ${isSale ? 'category / product' : 'category'} first.`);
            return;
        }
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
            {showSectionPicker && (
                <div
                    onClick={() => setShowSectionPicker(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 2000,
                        backgroundColor: 'rgba(15, 23, 42, 0.45)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        padding: '1rem',
                    }}
                >
                    <Card
                        padding="0"
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: 520,
                            borderRadius: '22px',
                            overflow: 'hidden',
                            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.28)',
                        }}
                    >
                        <div style={{
                            padding: '1rem 1.1rem',
                            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Choose Area</div>
                                <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>Select where this record belongs</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSectionPicker(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.18)',
                                    border: 'none',
                                    color: 'white',
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ padding: '0.9rem', maxHeight: '52vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gap: '0.65rem' }}>
                                {sections.map(section => {
                                    const active = String(section.id) === String(sectionId);
                                    return (
                                        <button
                                            key={section.id}
                                            type="button"
                                            onClick={() => {
                                                setSectionId(String(section.id));
                                                setShowSectionPicker(false);
                                            }}
                                            style={{
                                                textAlign: 'left',
                                                border: `1.5px solid ${active ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                                background: active ? 'var(--primary-50)' : 'white',
                                                color: 'var(--text-dark)',
                                                borderRadius: '16px',
                                                padding: '0.9rem 1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '0.75rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{section.name}</div>
                                                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                    {section.description || 'No description'}
                                                </div>
                                            </div>
                                            {active && (
                                                <span style={{
                                                    background: 'var(--primary-color)',
                                                    color: 'white',
                                                    padding: '0.25rem 0.55rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    flexShrink: 0,
                                                }}>
                                                    Selected
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {showCategoryPicker && (
                <div
                    onClick={() => setShowCategoryPicker(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 2000,
                        backgroundColor: 'rgba(15, 23, 42, 0.45)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        padding: '1rem',
                    }}
                >
                    <Card
                        padding="0"
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: 520,
                            borderRadius: '22px',
                            overflow: 'hidden',
                            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.28)',
                        }}
                    >
                        <div style={{
                            padding: '1rem 1.1rem',
                            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{isSale ? 'Choose Product' : 'Choose Expense Category'}</div>
                                <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>Pick the category for this record</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCategoryPicker(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.18)',
                                    border: 'none',
                                    color: 'white',
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ padding: '0.9rem', maxHeight: '52vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gap: '0.65rem' }}>
                                {categories.map(category => {
                                    const active = String(category.id) === String(categoryId);
                                    const subtitle = category.description || (isSale ? 'Sell item' : 'Expense item');
                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => {
                                                setCategoryId(String(category.id));
                                                setShowCategoryPicker(false);
                                            }}
                                            style={{
                                                textAlign: 'left',
                                                border: `1.5px solid ${active ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                                background: active ? 'var(--primary-50)' : 'white',
                                                color: 'var(--text-dark)',
                                                borderRadius: '16px',
                                                padding: '0.9rem 1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '0.75rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{category.name}</div>
                                                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                    {subtitle}
                                                </div>
                                            </div>
                                            {active && (
                                                <span style={{
                                                    background: 'var(--primary-color)',
                                                    color: 'white',
                                                    padding: '0.25rem 0.55rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    flexShrink: 0,
                                                }}>
                                                    Selected
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </div>
            )}

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
                            <button
                                type="button"
                                onClick={() => setShowSectionPicker(true)}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 0.95rem',
                                    borderRadius: '14px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    color: sectionId ? 'var(--text-dark)' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 0 rgba(15, 23, 42, 0.02)',
                                }}
                            >
                                <span style={{ textAlign: 'left' }}>
                                    <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Area</span>
                                    <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700 }}>
                                        {selectedSection ? selectedSection.name : 'Choose an area'}
                                    </span>
                                </span>
                                <span style={{ color: 'var(--primary-color)', fontSize: '1.1rem', lineHeight: 1 }}>▾</span>
                            </button>
                            <input type="hidden" value={sectionId} required readOnly />
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
                            <button
                                type="button"
                                onClick={() => setShowCategoryPicker(true)}
                                disabled={loadingConfig || categories.length === 0}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 0.95rem',
                                    borderRadius: '14px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    color: categoryId ? 'var(--text-dark)' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '0.75rem',
                                    cursor: loadingConfig || categories.length === 0 ? 'not-allowed' : 'pointer',
                                    opacity: loadingConfig || categories.length === 0 ? 0.75 : 1,
                                    boxShadow: '0 1px 0 rgba(15, 23, 42, 0.02)',
                                }}
                            >
                                <span style={{ textAlign: 'left' }}>
                                    <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                        {isSale ? 'Product' : 'Category'}
                                    </span>
                                    <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700 }}>
                                        {loadingConfig
                                            ? 'Loading...'
                                            : (selectedCategory ? selectedCategory.name : 'Choose a category')}
                                    </span>
                                </span>
                                <span style={{ color: 'var(--primary-color)', fontSize: '1.1rem', lineHeight: 1 }}>▾</span>
                            </button>
                            <input type="hidden" value={categoryId} readOnly />
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

                        <Button type="submit" fullWidth disabled={isSubmitting || loadingConfig || categories.length === 0 || !categoryId} style={{ marginTop: '1rem' }} variant={isSale ? 'primary' : 'danger'}>
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
