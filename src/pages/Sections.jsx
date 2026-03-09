import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { sectionsAPI } from '../api/client';
import { Map, Plus, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [animalCount, setAnimalCount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const fetchSections = async () => {
        setLoading(true);
        try {
            const response = await sectionsAPI.getSections();
            if (response.success) {
                setSections(response.sections || []);
            }
        } catch (err) {
            console.error("Failed to fetch sections", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await sectionsAPI.createSection({
                name, description, animal_count: Number(animalCount) || 0, icon: 'fa-cube'
            });
            if (res.success) {
                setShowAddForm(false);
                setName('');
                setDescription('');
                setAnimalCount('');
                fetchSections();
            }
        } catch (err) {
            console.error("Failed to create section", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && sections.length === 0) return <div className="flex-center" style={{ height: '50vh' }}>Loading Sections...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: 0 }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <Map size={24} color="var(--primary-color)" /> Manage Areas
                    </h2>
                </div>
                {!showAddForm && (
                    <Button size="sm" onClick={() => setShowAddForm(true)}>
                        <Plus size={16} /> Add New
                    </Button>
                )}
            </div>

            {showAddForm && (
                <Card className="animate-slide-up" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Add New Area</h3>
                        <button
                            onClick={() => setShowAddForm(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Area Name</label>
                            <input
                                type="text"
                                value={name} onChange={(e) => setName(e.target.value)} required
                                placeholder="e.g. North Pasture, Greenhouse 1"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Description (Optional)</label>
                            <input
                                type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Animal Count / Size</label>
                            <input
                                type="number" value={animalCount} onChange={(e) => setAnimalCount(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <Button type="submit" fullWidth disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Area'}
                        </Button>
                    </form>
                </Card>
            )}

            {sections.length === 0 && !showAddForm ? (
                <Card style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <Map size={48} style={{ opacity: 0.5, margin: '0 auto' }} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>No Areas Found</h3>
                    <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        You haven't defined any farming areas yet. Create one to start tracking expenses and sales!
                    </p>
                    <Button onClick={() => setShowAddForm(true)}>Create Your First Area</Button>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sections.map(section => (
                        <Card
                            key={section.id}
                            padding="1rem"
                            hoverable
                            onClick={() => navigate(`/sections/${section.id}`)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-dark)' }}>{section.name}</h3>
                                {section.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{section.description}</div>}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                {section.animal_count > 0 && <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-main)', padding: '2px 8px', borderRadius: '12px' }}>Count: {section.animal_count}</span>}
                                <ChevronRight size={20} />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Sections;
