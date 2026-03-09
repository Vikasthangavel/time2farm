import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sectionsAPI } from '../api/client';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Trash2, Plus, Tag } from 'lucide-react';

const TypeManager = ({ title, items, onAdd, onDelete }) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [showAdd, setShowAdd] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        onAdd(name, desc);
        setName('');
        setDesc('');
        setShowAdd(false);
    };

    return (
        <Card style={{ marginTop: '1rem' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={18} color="var(--primary-color)" /> {title}
                </h3>
                {!showAdd && (
                    <Button size="sm" variant="ghost" onClick={() => setShowAdd(true)}>
                        <Plus size={16} /> Add
                    </Button>
                )}
            </div>

            {showAdd && (
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '8px' }}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Name (e.g. Feed, Labor)" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                    <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description (Optional)" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button type="submit" size="sm">Save</Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                    </div>
                </form>
            )}

            {items.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>No items added yet.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {items.map(item => (
                        <div key={item.id} className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                            <div>
                                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{item.name}</div>
                                {item.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.description}</div>}
                            </div>
                            <button
                                onClick={() => onDelete(item.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: '4px' }}
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

const SectionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [section, setSection] = useState(null);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [sellTypes, setSellTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const [secRes, expRes, sellRes] = await Promise.all([
                sectionsAPI.getSectionDetails(id),
                sectionsAPI.getExpenseTypes(id),
                sectionsAPI.getSellTypes(id)
            ]);
            if (secRes.success) setSection(secRes.section);
            if (expRes.success) setExpenseTypes(expRes.expense_types);
            if (sellRes.success) setSellTypes(sellRes.sell_types);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDetails(); }, [id]);

    if (loading) return <div className="flex-center" style={{ height: '50vh' }}>Loading...</div>;
    if (!section) return <div className="flex-center" style={{ padding: '2rem' }}>Section not found.</div>;

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this area? This action cannot be undone and will delete all related records.")) {
            await sectionsAPI.deleteSection(id);
            navigate('/sections');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button onClick={() => navigate('/sections')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{section.name}</h2>
            </div>

            <Card>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Area Description</div>
                <div style={{ fontSize: '1rem' }}>{section.description || 'No description provided.'}</div>
                {section.animal_count > 0 && (
                    <div style={{ marginTop: '0.5rem', fontWeight: '500' }}>Count / Size: {section.animal_count}</div>
                )}
            </Card>

            <TypeManager
                title="Expense Categories"
                items={expenseTypes}
                onAdd={async (n, d) => { await sectionsAPI.addExpenseType(id, n, d); fetchDetails(); }}
                onDelete={async (tid) => { await sectionsAPI.deleteExpenseType(tid); fetchDetails(); }}
            />

            <TypeManager
                title="Sell Categories"
                items={sellTypes}
                onAdd={async (n, d) => { await sectionsAPI.addSellType(id, n, 'unit', d); fetchDetails(); }}
                onDelete={async (tid) => { await sectionsAPI.deleteSellType(tid); fetchDetails(); }}
            />

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Button variant="danger" onClick={handleDelete} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trash2 size={18} /> Delete Entire Area
                </Button>
            </div>
        </div>
    );
};

export default SectionDetail;
