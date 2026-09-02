import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../api/client';
import {
  Users, Layers, TrendingUp, TrendingDown, DollarSign,
  BarChart2, LogOut, RefreshCw, ShieldCheck, Eye, EyeOff,
  Activity, UserPlus, Clock
} from 'lucide-react';

/* ─── Helpers ───────────────────────────────────────────────── */
const fmt = (n) => Number(n || 0).toLocaleString('en-IN');
const fmtINR = (n) => `\u20B9${fmt(n)}`;
const fmtDate = (iso) => {
  if (!iso) return '\u2014';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const fmtDateTime = (iso) => {
  if (!iso) return '\u2014';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

/* ─── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div style={{
    background: '#fff', borderRadius: 16, padding: '1.25rem 1.5rem',
    display: 'flex', alignItems: 'center', gap: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderLeft: `4px solid ${color}`,
    flex: '1 1 180px', minWidth: 0,
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: color + '18',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={22} color={color} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: '0.72rem', color: '#637560', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f1f0c', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#637560', marginTop: 3 }}>{sub}</div>}
    </div>
  </div>
);

/* ─── Mini Bar Chart ─────────────────────────────────────────── */
const MiniBarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div
            title={`${d.day}: ${d.count} tx`}
            style={{
              width: '100%',
              height: `${Math.max((d.count / max) * 64, 4)}px`,
              background: 'linear-gradient(180deg, #4a9e3f, #72c263)',
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.4s ease',
            }}
          />
          <div style={{ fontSize: '0.6rem', color: '#637560', whiteSpace: 'nowrap' }}>
            {new Date(d.day).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Password Modal ─────────────────────────────────────────── */
const PasswordModal = ({ onSuccess }) => {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pw.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await adminAPI.verify(pw);
      if (res.success) { onSuccess(); }
      else { setError('Incorrect password. Please try again.'); }
    } catch { setError('Authentication failed. Check backend connection.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, #0f1f0c 0%, #1a3a10 50%, #0f2d0a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem',
    }}>
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(74,158,63,0.12)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(114,194,99,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 24, padding: '2.5rem 2rem',
        width: '100%', maxWidth: 400,
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        position: 'relative',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #4a9e3f, #72c263)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(74,158,63,0.4)',
          }}>
            <ShieldCheck size={30} color="white" />
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Admin Access</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: '0.4rem 0 0' }}>
            Time2Farm \u00B7 Admin Dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 500, marginBottom: 8 }}>Admin Password</label>
          <div style={{ position: 'relative', marginBottom: error ? '0.5rem' : '1.25rem' }}>
            <input
              id="admin-password"
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              style={{
                width: '100%', padding: '0.75rem 3rem 0.75rem 1rem',
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.18)'}`,
                borderRadius: 10, color: '#fff', fontSize: '0.95rem',
                outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
            />
            <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4, display: 'flex', alignItems: 'center' }}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <div style={{ color: '#fca5a5', fontSize: '0.8rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: 8, padding: '0.5rem 0.75rem', border: '1px solid rgba(239,68,68,0.25)' }}>
              {error}
            </div>
          )}
          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading || !pw.trim()}
            style={{
              width: '100%', padding: '0.8rem',
              background: loading || !pw.trim() ? 'rgba(74,158,63,0.4)' : 'linear-gradient(135deg, #4a9e3f, #72c263)',
              border: 'none', borderRadius: 10, color: '#fff',
              fontWeight: 600, fontSize: '0.95rem',
              cursor: loading || !pw.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading
              ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Verifying\u2026</>
              : <><ShieldCheck size={16} /> Access Dashboard</>}
          </button>
        </form>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

/* ─── Main Admin Dashboard ───────────────────────────────────── */
const AdminDashboard = () => {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('time2farm.admin.pw'));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await adminAPI.getOverview();
      if (res.success) { setData(res); setLastRefresh(new Date()); }
      else {
        setError(res.message || 'Failed to load overview');
        if (res.message?.includes('Admin access')) { setAuthed(false); localStorage.removeItem('time2farm.admin.pw'); }
      }
    } catch { setError('Network error. Is the backend running?'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (authed) fetchOverview(); }, [authed, fetchOverview]);

  const handleLogout = async () => { await adminAPI.logout(); setAuthed(false); setData(null); };

  if (!authed) return <PasswordModal onSuccess={() => setAuthed(true)} />;

  const ov = data?.overview || {};
  const topUsers = data?.top_users || [];
  const recentUsers = data?.recent_users || [];
  const recentDaily = data?.recent_daily || [];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5faf4 0%, #e8f5e3 100%)', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Top Bar */}
      <div style={{ background: 'linear-gradient(135deg, #0f2d0a 0%, #1a4a10 100%)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #4a9e3f, #72c263)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={18} color="white" />
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>Time2Farm Admin</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>Platform Overview</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {lastRefresh && (
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>
              <Clock size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button id="admin-refresh-btn" onClick={fetchOverview} disabled={loading} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 8, padding: '0.45rem 0.85rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} /> Refresh
          </button>
          <button id="admin-logout-btn" onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: 8, padding: '0.45rem 0.85rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1rem' }}>
        {error && (
          <div style={{ background: '#fde8e8', border: '1px solid #fca5a5', borderRadius: 12, padding: '0.875rem 1.25rem', color: '#b91c1c', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            \u26A0 {error}
          </div>
        )}

        {loading && !data && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#637560' }}>
            <div style={{ width: 40, height: 40, margin: '0 auto 1rem', border: '3px solid #d6f0d0', borderTopColor: '#4a9e3f', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            <p style={{ margin: 0 }}>Loading platform data\u2026</p>
          </div>
        )}

        {data && (
          <>
            {/* Stat Cards */}
            <section style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#637560', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>Platform Overview</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
                <StatCard icon={Users}        label="Total Users"       value={fmt(ov.total_users)}        color="#4a9e3f" sub="Registered farmers" />
                <StatCard icon={Activity}     label="Active (30d)"      value={fmt(ov.active_users)}       color="#06b6d4" sub="Last 30 days" />
                <StatCard icon={UserPlus}     label="New This Month"    value={fmt(ov.new_users_month)}    color="#8b5cf6" sub="Month to date" />
                <StatCard icon={Layers}       label="Farm Sections"     value={fmt(ov.total_sections)}     color="#f59e0b" sub="Created by users" />
                <StatCard icon={BarChart2}    label="Transactions"      value={fmt(ov.total_transactions)} color="#10b981" sub="All time" />
                <StatCard icon={TrendingUp}   label="Total Revenue"     value={fmtINR(ov.total_revenue)}   color="#4a9e3f" sub="From sales" />
                <StatCard icon={TrendingDown} label="Total Expenses"    value={fmtINR(ov.total_expenses)}  color="#ef4444" sub="Platform-wide" />
                <StatCard icon={DollarSign}   label="Net Profit"        value={fmtINR(ov.net_profit)}      color={ov.net_profit >= 0 ? '#4a9e3f' : '#ef4444'} sub={ov.net_profit >= 0 ? 'Positive' : 'Loss'} />
              </div>
            </section>

            {/* Chart + Ratios */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: '1 1 300px', minWidth: 0 }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f1f0c', marginBottom: '0.25rem' }}>Daily Transactions (Last 7 days)</h3>
                <p style={{ fontSize: '0.72rem', color: '#637560', margin: '0 0 1rem' }}>Transaction count per day</p>
                {recentDaily.length > 0
                  ? <MiniBarChart data={recentDaily} />
                  : <div style={{ textAlign: 'center', color: '#637560', fontSize: '0.85rem', padding: '2rem' }}>No data yet</div>
                }
              </div>
              <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: '1 1 240px', minWidth: 0 }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f1f0c', marginBottom: '1rem' }}>Key Ratios</h3>
                {[
                  { label: 'Avg sections / user', value: ov.total_users ? (ov.total_sections / ov.total_users).toFixed(1) : '\u2014' },
                  { label: 'Avg transactions / user', value: ov.total_users ? (ov.total_transactions / ov.total_users).toFixed(1) : '\u2014' },
                  { label: 'Avg revenue / user', value: ov.total_users ? fmtINR(ov.total_revenue / ov.total_users) : '\u2014' },
                  { label: 'Active user rate', value: ov.total_users ? `${((ov.active_users / ov.total_users) * 100).toFixed(0)}%` : '\u2014' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #ddebd8', fontSize: '0.85rem' }}>
                    <span style={{ color: '#637560' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: '#0f1f0c' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Users */}
            <section style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#637560', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>Top Users by Activity</h2>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f5faf4', borderBottom: '2px solid #ddebd8' }}>
                        {['#', 'User', 'Username', 'Joined', 'Transactions', 'Revenue', 'Expenses', 'Profit'].map(h => (
                          <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#637560', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {topUsers.map((u, i) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #ddebd8' }}>
                          <td style={{ padding: '0.75rem 1rem', color: '#637560', fontWeight: 500 }}>{i + 1}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `hsl(${(u.id * 47) % 360}, 60%, 90%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: `hsl(${(u.id * 47) % 360}, 60%, 35%)`, flexShrink: 0 }}>
                                {(u.full_name || u.username || '?')[0].toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 500, color: '#0f1f0c', whiteSpace: 'nowrap' }}>{u.full_name || '\u2014'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#637560' }}>@{u.username}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#637560', whiteSpace: 'nowrap' }}>{fmtDate(u.created_at)}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{ background: '#d6f0d0', color: '#2d6a27', padding: '0.2rem 0.6rem', borderRadius: 20, fontWeight: 600, fontSize: '0.8rem' }}>{fmt(u.tx_count)}</span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#4a9e3f', fontWeight: 600 }}>{fmtINR(u.revenue)}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#ef4444', fontWeight: 600 }}>{fmtINR(u.expenses)}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: (u.revenue - u.expenses) >= 0 ? '#4a9e3f' : '#ef4444' }}>
                            {fmtINR(u.revenue - u.expenses)}
                          </td>
                        </tr>
                      ))}
                      {topUsers.length === 0 && <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#637560' }}>No users found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Recent Sign-ups */}
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#637560', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>Recent Sign-ups</h2>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f5faf4', borderBottom: '2px solid #ddebd8' }}>
                        {['User', 'Username', 'Email', 'Phone', 'Farm Name', 'Joined', 'Last Login'].map(h => (
                          <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#637560', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #ddebd8' }}>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `hsl(${(u.id * 83) % 360}, 55%, 90%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: `hsl(${(u.id * 83) % 360}, 55%, 35%)`, flexShrink: 0 }}>
                                {(u.full_name || u.username || '?')[0].toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 500, color: '#0f1f0c', whiteSpace: 'nowrap' }}>{u.full_name || '\u2014'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#637560' }}>@{u.username}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#637560' }}>{u.email || '\u2014'}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#637560' }}>{u.phone || '\u2014'}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#0f1f0c', fontWeight: 500 }}>{u.farm_name || '\u2014'}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#637560', whiteSpace: 'nowrap' }}>{fmtDate(u.created_at)}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#637560', whiteSpace: 'nowrap' }}>{fmtDateTime(u.last_login)}</td>
                        </tr>
                      ))}
                      {recentUsers.length === 0 && <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#637560' }}>No users found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <div style={{ textAlign: 'center', color: '#637560', fontSize: '0.75rem', paddingBottom: '1.5rem' }}>
              Time2Farm Admin \u00B7 Data refreshed at {lastRefresh?.toLocaleTimeString('en-IN')}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminDashboard;
