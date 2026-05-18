import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, LineChart, User, Sprout, Menu, X } from 'lucide-react';
import ChatWidget from './ChatWidget';

const navItems = [
    { icon: Home,       label: 'Home',     path: '/' },
    { icon: PlusCircle, label: 'Add',      path: '/add-action' },
    { icon: LineChart,  label: 'Reports',  path: '/reports' },
    { icon: User,       label: 'Profile',  path: '/settings' },
];

/* ── Sidebar (desktop) ─────────────────────── */
const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (item) =>
        location.pathname === item.path ||
        (item.path === '/add-action' &&
            (location.pathname.includes('/add-expense') ||
             location.pathname.includes('/record-sale')));

    return (
        <aside className="sidebar" style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
        }}>
            {/* Brand */}
            <div style={{
                padding: '1.5rem 1.25rem 1.25rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            }}>
                <div style={{
                    width: 36, height: 36,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Sprout size={20} color="white" />
                </div>
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
            <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
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

            {/* Footer hint */}
            <div style={{
                padding: '1rem 1.25rem',
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
            }}>
                🌱 Smart Farming Companion
            </div>
        </aside>
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
             location.pathname.includes('/record-sale')));

    return (
        <nav className="bottom-nav" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '64px',
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom)',
            zIndex: 100,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
        }}>
            {navItems.map((item) => {
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
                            gap: '3px',
                            color: active ? 'var(--primary-color)' : 'var(--text-muted)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            flex: 1,
                            padding: '6px 0',
                        }}
                    >
                        <div style={{
                            padding: active ? '4px 12px' : '4px 8px',
                            borderRadius: '20px',
                            background: active ? 'var(--primary-100)' : 'transparent',
                            transition: 'all 0.2s',
                        }}>
                            <Icon size={20} />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: active ? '600' : '400' }}>
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
            <Sidebar />

            <div className="main-content" style={{ flex: 1 }}>
                <Outlet />
            </div>

            <ChatWidget />
            <BottomNavigation />
        </div>
    );
};

export default Layout;
