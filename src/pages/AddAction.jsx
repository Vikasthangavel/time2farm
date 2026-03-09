import React from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import { TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddAction = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
            <Header />

            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle size={24} color="var(--primary-color)" /> Add Action
                </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Card
                    padding="1.5rem"
                    hoverable
                    onClick={() => navigate('/record-sale')}
                    className="animate-slide-up"
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                    <div style={{
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        color: 'var(--primary-color)',
                        padding: '1rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>Record Sale</h3>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Record income from selling crops, milk, or animals.</p>
                    </div>
                </Card>

                <Card
                    padding="1.5rem"
                    hoverable
                    onClick={() => navigate('/add-expense')}
                    className="animate-slide-up"
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', animationDelay: '0.1s' }}
                >
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--accent-red)',
                        padding: '1rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TrendingDown size={32} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>Add Expense</h3>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Log money spent on seeds, fertilizer, labor, or feed.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AddAction;
