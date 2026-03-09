import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, LineChart, User } from 'lucide-react';
import ChatWidget from './ChatWidget';

const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: <Home size={24} />, label: 'Home', path: '/' },
        { icon: <PlusCircle size={24} />, label: 'Add', path: '/add-action' },
        { icon: <LineChart size={24} />, label: 'Reports', path: '/reports' },
        { icon: <User size={24} />, label: 'Profile', path: '/settings' },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '65px',
            backgroundColor: 'white',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom)'
        }}>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path === '/add-action' && (location.pathname.includes('/add-expense') || location.pathname.includes('/record-sale')));
                return (
                    <div
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            width: '25%'
                        }}
                    >
                        {item.icon}
                        <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '500' : '400' }}>
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const Layout = () => {
    return (
        <>
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem', // Reduced from 1.5rem for better fit
                paddingBottom: '80px', // Space for bottom nav
                backgroundColor: 'var(--bg-main)'
            }}>
                <Outlet />
            </div>
            <ChatWidget />
            <BottomNavigation />
        </>
    );
};

export default Layout;
