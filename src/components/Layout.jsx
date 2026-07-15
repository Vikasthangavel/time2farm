import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, PlusCircle, LineChart, User, LogOut, History, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatWidget from './ChatWidget';

const navItems = [
    { icon: Home,       label: 'Home',         path: '/' },
    { icon: Store,      label: 'Mandi Rates',  path: '/mandi-prices' },
    { icon: PlusCircle, label: 'Add',          path: '/add-action' },
    { icon: History,    label: 'Transactions', path: '/transactions' },
    { icon: LineChart,  label: 'Reports',      path: '/reports' },
    { icon: User,       label: 'Profile',      path: '/settings' },
];

const mobileNavItems = [
    { icon: Home,       label: 'Home',         path: '/' },
    { icon: Store,      label: 'Mandi',        path: '/mandi-prices' },
    { icon: PlusCircle, label: 'Add',          path: '/add-action' },
    { icon: History,    label: 'Records',      path: '/transactions' },
    { icon: LineChart,  label: 'Reports',      path: '/reports' },
    { icon: User,       label: 'Profile',      path: '/settings' },
];

/* ── Sidebar (desktop only) ────────────────── */
const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (item) =>
        location.pathname === item.path ||
        (item.path === '/add-action' &&
            (location.pathname.includes('/add-expense') ||
             location.pathname.includes('/record-sale'))) ||
        (item.path === '/transactions' && location.pathname === '/transactions');

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: 'var(--sidebar-width)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-color)',
            zIndex: 200,
        }}>
            {/* Brand */}
            <div style={{
                padding: '1.25rem 1.25rem 1rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            }}>
                <img
                    src="/logo.png"
                    alt="Time2Farm logo"
                    style={{ width: 38, height: 38, objectFit: 'contain', flexShrink: 0 }}
                />
                <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)', lineHeight: 1.2 }}>
                        Time2Farm
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        Farm Manager
                    </div>
                </div>
            </div>

            {/* Nav links */}
            <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                {navItems.map((item) => {
                    const active = isActive(item);
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '0.625rem 0.875rem',
                                borderRadius: 'var(--border-radius)',
                                background: active ? 'var(--primary-50)' : 'transparent',
                                color: active ? 'var(--primary-dark)' : 'var(--text-muted)',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: active ? '600' : '400',
                                fontSize: '0.9rem',
                                transition: 'all 0.15s',
                                width: '100%',
                                textAlign: 'left',
                            }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-main)'; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                        >
                            <Icon size={18} />
                            {item.label}
                            {active && (
                                <div style={{
                                    marginLeft: 'auto',
                                    width: 6, height: 6,
                                    borderRadius: '50%',
                                    background: 'var(--primary-color)',
                                }} />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '0.625rem 0.875rem',
                        borderRadius: 'var(--border-radius)',
                        background: 'transparent',
                        color: 'var(--accent-red)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        transition: 'all 0.15s',
                        width: '100%',
                        textAlign: 'left',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-red-light)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                    <LogOut size={18} />
                    Logout
                </button>
                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <Link to="/terms-and-conditions" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms</Link>
                    {' • '}
                    <Link to="/privacy-policy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</Link>
                </div>
            </div>
        </aside>
    );
};

/* ── Mobile Top App Bar ───────────────────────
   Fixed at the top. Visible on ALL pages with the SAME UI.
   Hidden on desktop — sidebar handles branding there.
   ─────────────────────────────────────────── */
const PAGE_TITLES = {
    '/':                 'Dashboard',
    '/mandi-prices':     'Mandi Prices',
    '/add-action':       'Add Action',
    '/record-sale':      'Record Sale',
    '/add-expense':      'Add Expense',
    '/transactions':     'Transactions',
    '/reports':          'Reports',
    '/reports/download': 'Download Report',
    '/settings':         'Profile',
    '/profile':          'Profile',
    '/ai-assistant':     'AI Assistant',
};

const TopAppBar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const title =
        PAGE_TITLES[location.pathname] ??
        (location.pathname.startsWith('/sections') ? 'Farm Areas' : 'Time2Farm');

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="mobile-top-bar" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 'var(--mobile-top-bar-height)',
            backgroundColor: 'var(--primary-color)',
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            zIndex: 200,
            boxShadow: '0 2px 12px rgba(74,158,63,0.25)',
        }}>
            {/* Logo + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <img
                    src="/logo.png"
                    alt="Time2Farm"
                    style={{ width: 30, height: 30, objectFit: 'contain', flexShrink: 0, borderRadius: 6 }}
                />
                <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', lineHeight: 1.15 }}>
                        Time2Farm
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1, fontWeight: 400 }}>
                        {title}
                    </div>
                </div>
            </div>

            {/* Logout icon */}
            <button
                onClick={handleLogout}
                title="Logout"
                style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#ffffff',
                    padding: '7px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    transition: 'background 0.2s',
                    flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
            >
                <LogOut size={15} />
            </button>
        </header>
    );
};

/* ── Bottom Navigation (mobile) ─────────────── */
const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (item) =>
        location.pathname === item.path ||
        (item.path === '/add-action' &&
            (location.pathname.includes('/add-expense') ||
             location.pathname.includes('/record-sale'))) ||
        (item.path === '/transactions' && location.pathname === '/transactions');

    return (
        <nav className="bottom-nav" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'var(--mobile-nav-height)',
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom)',
            zIndex: 100,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
            transform: 'translateZ(0)',
            willChange: 'transform',
            overflow: 'hidden',
        }}>
            {mobileNavItems.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            color: active ? 'var(--primary-color)' : 'var(--text-muted)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            flex: 1,
                            padding: '6px 2px 8px',
                            minWidth: 0,
                            height: '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        <div style={{
                            width: 34,
                            height: 34,
                            borderRadius: '9999px',
                            background: active ? 'var(--primary-100)' : 'transparent',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <Icon size={20} strokeWidth={2.2} />
                        </div>
                        <span style={{
                            fontSize: '0.64rem',
                            fontWeight: active ? '600' : '500',
                            lineHeight: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                        }}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

/* ── Layout Shell ────────────────────────────── */
const Layout = () => {
    return (
        <div className="app-shell" style={{ minHeight: '100vh', display: 'flex' }}>
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Mobile top bar — always fixed, same UI on every page */}
            <TopAppBar />

            {/* Page content */}
            <div className="main-content" style={{ flex: 1 }}>
                <Outlet />
            </div>

            <ChatWidget />
            <BottomNavigation />
        </div>
    );
};

export default Layout;
