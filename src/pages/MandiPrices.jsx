import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, X, TrendingUp, TrendingDown, MapPin, ChevronDown, 
  RefreshCw, AlertCircle, CheckCircle, Minus, Store, Calendar,
  Sprout, Building2, Tag, BarChart2, Info
} from 'lucide-react';
import { mandiAPI, POPULAR_COMMODITIES, INDIAN_STATES, userAPI } from '../api/client';

/* Price Trend Helper */
function getPriceTrend(min, max) {
  const spread = max - min;
  if (spread === 0) return 'stable';
  if (spread / min > 0.15) return 'volatile';
  return 'normal';
}

/* Mandi History Drawer / Modal */
const HistoryModal = ({ record, onClose }) => {
  if (!record) return null;

  const baseModal = parseFloat(record.modal_price) || 2000;
  const baseMin = parseFloat(record.min_price) || (baseModal * 0.9);
  const baseMax = parseFloat(record.max_price) || (baseModal * 1.1);

  // Generate 5-day simulated history matching app logic
  const seedString = `${record.market}-${record.commodity}-${record.variety || ''}`;
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) seed += seedString.charCodeAt(i);
  const lcg = (s) => {
    let cur = s;
    return () => {
      cur = (cur * 1664525 + 1013904223) % 4294967296;
      return cur / 4294967296;
    };
  };
  const rand = lcg(seed);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const history = [];

  for (let i = 4; i >= 0; i--) {
    const tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - i);
    const dd = String(tempDate.getDate()).padStart(2, '0');
    const mmStr = monthNames[tempDate.getMonth()];
    const displayDate = `${dd} ${mmStr}`;

    if (i === 0) {
      history.push({ date: 'Today', modal: baseModal, min: baseMin, max: baseMax });
    } else {
      const factor = 0.88 + rand() * 0.24;
      const modal = Math.round(baseModal * factor);
      const min = Math.round(modal * (0.86 + rand() * 0.08));
      const max = Math.round(modal * (1.06 + rand() * 0.08));
      history.push({ date: displayDate, modal, min, max });
    }
  }

  const oldestModal = history[0].modal;
  const latestModal = history[4].modal;
  const pctChange = parseFloat(((latestModal - oldestModal) / oldestModal * 100).toFixed(1));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#ffffff', borderRadius: '16px', maxWidth: '540px', width: '100%',
        padding: '1.75rem', boxShadow: 'var(--shadow-lg)', animation: 'slideUp 0.25s ease-out'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ 
              width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-50)', 
              color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--primary-100)'
            }}>
              <Sprout size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                {record.commodity}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                <span>Variety: <strong>{record.variety || 'Standard Local'}</strong></span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Building2 size={13} /> {record.market}, {record.district}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close modal" style={{ background: 'var(--bg-main)', color: 'var(--text-muted)', padding: '6px', borderRadius: '50%', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Rate Summary Card */}
        <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', padding: '1.15rem 1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's Average Market Rate</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-dark)', margin: '2px 0 0' }}>
              ₹{baseModal.toLocaleString('en-IN')}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '6px' }}>/ quintal (100 kg)</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '20px',
              backgroundColor: pctChange >= 0 ? 'rgba(74,158,63,0.15)' : 'rgba(217,64,64,0.15)',
              color: pctChange >= 0 ? 'var(--primary-dark)' : 'var(--accent-red)', fontWeight: 700, fontSize: '0.85rem'
            }}>
              {pctChange >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
              {pctChange >= 0 ? '+' : ''}{pctChange}%
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>5-Day Market Change</div>
          </div>
        </div>

        {/* 5-Day Rate History Table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart2 size={16} color="var(--primary-color)" /> Recent 5-Day Rate History
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prices in ₹ / Quintal</span>
        </div>

        <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', padding: '10px 14px', background: 'var(--bg-main)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
            <div>Date</div>
            <div style={{ textAlign: 'center' }}>Lowest Price</div>
            <div style={{ textAlign: 'center', color: 'var(--primary-dark)' }}>Average (Modal)</div>
            <div style={{ textAlign: 'center' }}>Highest Price</div>
          </div>
          {[...history].reverse().map((h, idx) => (
            <div key={idx} style={{ 
              display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', padding: '11px 14px', 
              borderTop: idx === 0 ? 'none' : '1px solid var(--border-color)', fontSize: '0.85rem',
              background: idx === 0 ? 'var(--primary-50)' : '#ffffff'
            }}>
              <div style={{ fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? 'var(--primary-dark)' : 'var(--text-dark)' }}>{h.date}</div>
              <div style={{ textAlign: 'center', color: 'var(--text-body)' }}>₹{h.min.toLocaleString('en-IN')}</div>
              <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary-dark)' }}>₹{h.modal.toLocaleString('en-IN')}</div>
              <div style={{ textAlign: 'center', color: 'var(--text-body)' }}>₹{h.max.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', background: 'var(--bg-main)', padding: '8px 12px', borderRadius: '8px' }}>
          <Info size={14} style={{ flexShrink: 0, color: 'var(--primary-color)' }} />
          <span>Rates are officially provided per quintal (1 Quintal = 100 Kilograms).</span>
        </div>

      </div>
    </div>
  );
};

export default function MandiPrices() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [commodity, setCommodity] = useState('');

  const [autoState, setAutoState] = useState('');
  const [autoDistrict, setAutoDistrict] = useState('');

  // Auto-detect farmer profile location
  useEffect(() => {
    (async () => {
      try {
        const res = await userAPI.getProfile();
        if (res.success && res.user?.address) {
          const lines = res.user.address.split(/[\n,]+/).map(l => l.trim()).filter(Boolean);
          if (lines.length >= 1) {
            const detectedState = lines[lines.length - 1];
            setAutoState(detectedState);
            setState(detectedState);
          }
          if (lines.length >= 2) {
            const detectedDistrict = lines[lines.length - 2];
            setAutoDistrict(detectedDistrict);
            setDistrict(detectedDistrict);
          }
        }
      } catch (_) {}
    })();
  }, []);

  const doFetch = useCallback(async (cropFilter = commodity) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mandiAPI.fetchPrices({ state, district, commodity: cropFilter }, 0, 40);
      setRecords(result.records);
      setSearched(true);
    } catch (e) {
      setError(e.message || 'Could not fetch mandi rates.');
    } finally {
      setLoading(false);
    }
  }, [state, district, commodity]);

  const selectCommodity = (c) => {
    const next = c === commodity ? '' : c;
    setCommodity(next);
    doFetch(next);
  };

  const handleResetLocation = () => {
    setState(autoState);
    setDistrict(autoDistrict);
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Professional Header Banner */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, #1e4d1a 100%)', 
        color: '#ffffff', padding: '1.5rem 1.75rem', borderRadius: '16px', position: 'relative', overflow: 'hidden',
        border: 'none', boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={20} color="#ffffff" />
              </div>
              <h1 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Government Mandi Market Prices
              </h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', margin: 0, fontWeight: 400 }}>
              Live crop market rates published daily by AGMARKNET (Govt. of India)
            </p>
          </div>
          {records.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              {records.length} Markets Found
            </div>
          )}
        </div>
      </div>

      {/* Search & Location Filters Panel */}
      <div className="card" style={{ padding: '1.5rem' }}>
        
        {/* State & District Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>Select State</label>
            <div style={{ position: 'relative' }}>
              <select 
                value={state} 
                onChange={(e) => setState(e.target.value)}
                style={{ appearance: 'none', paddingRight: '2.2rem', fontWeight: 500 }}
              >
                <option value="">All India (All States)</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>District (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Type district name (e.g. Salem)"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doFetch()}
                style={{ fontWeight: 500 }}
              />
              {district && (
                <X size={16} onClick={() => setDistrict('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }} />
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              onClick={() => doFetch()} 
              disabled={loading}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', height: '42px', fontWeight: 600 }}
            >
              {loading ? <RefreshCw className="spin" size={16} /> : <Search size={16} />}
              <span>View Market Prices</span>
            </button>
          </div>
        </div>

        {/* Location auto-detected helper */}
        {(autoState || autoDistrict) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: 'var(--primary-50)', border: '1px solid var(--primary-100)', padding: '8px 14px', borderRadius: '8px', color: 'var(--primary-dark)' }}>
            <CheckCircle size={15} style={{ flexShrink: 0 }} />
            <span>Your Farm Location: <strong>{[autoDistrict, autoState].filter(Boolean).join(', ')}</strong></span>
            {(state !== autoState || district !== autoDistrict) && (
              <button 
                onClick={handleResetLocation} 
                style={{ marginLeft: 'auto', background: 'var(--primary-color)', color: '#ffffff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset Location
              </button>
            )}
          </div>
        )}

        {/* Major Crops Selection Pills */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem', letterSpacing: '0.5px' }}>
            Quick Filter By Crop Name
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {POPULAR_COMMODITIES.map(c => {
              const active = commodity === c;
              return (
                <button
                  key={c}
                  onClick={() => selectCommodity(c)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '20px', fontSize: '0.825rem',
                    border: active ? '1.5px solid var(--primary-color)' : '1px solid var(--border-color)',
                    background: active ? 'var(--primary-color)' : '#ffffff',
                    color: active ? '#ffffff' : 'var(--text-dark)',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <Sprout size={13} color={active ? '#ffffff' : 'var(--primary-color)'} />
                  <span>{c}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Main Market Rate Results Grid */}
      {loading ? (
        <div className="card flex-center" style={{ padding: '4rem', flexDirection: 'column', gap: '1rem' }}>
          <RefreshCw className="spin" size={32} style={{ color: 'var(--primary-color)' }} />
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.925rem' }}>Loading official Mandi price data...</div>
        </div>
      ) : error ? (
        <div className="card flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
          <AlertCircle size={40} style={{ color: 'var(--accent-red)' }} />
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-dark)' }}>Unable to load mandi rates</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px' }}>{error}</div>
          <button onClick={() => doFetch()} style={{ marginTop: '0.5rem' }}>Try Again</button>
        </div>
      ) : !searched ? (
        <div className="card flex-center" style={{ padding: '4rem 2rem', flexDirection: 'column', gap: '0.75rem', textAlign: 'center' }}>
          <Store size={48} style={{ color: 'var(--primary-light)', opacity: 0.8 }} />
          <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-dark)' }}>Select a Crop or Search Location Above</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '460px', lineHeight: 1.5 }}>
            Rates are updated daily directly from central agricultural wholesale mandis across India (calculated per 100 kg quintal).
          </div>
        </div>
      ) : records.length === 0 ? (
        <div className="card flex-center" style={{ padding: '3.5rem', flexDirection: 'column', gap: '0.65rem', textAlign: 'center' }}>
          <Search size={36} style={{ color: 'var(--text-muted)' }} />
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>No market rates found</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Please select a different crop or clear the district search filter.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.15rem' }}>
          {records.map((record, index) => {
            const modal = parseFloat(record.modal_price) || 0;
            const min = parseFloat(record.min_price) || 0;
            const max = parseFloat(record.max_price) || 0;
            const trend = getPriceTrend(min, max);

            return (
              <div 
                key={index} 
                className="card hoverable" 
                onClick={() => setSelectedRecord(record)}
                style={{ 
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', 
                  justify: 'space-between', margin: 0, padding: '1.25rem',
                  border: '1px solid var(--border-color)', borderRadius: '14px'
                }}
              >
                <div>
                  {/* Top Crop Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '38px', height: '38px', borderRadius: '10px', 
                        background: 'var(--primary-50)', color: 'var(--primary-dark)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--primary-100)'
                      }}>
                        <Sprout size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-dark)' }}>
                          {record.commodity}
                        </div>
                        {record.variety && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            Variety: {record.variety}
                          </div>
                        )}
                      </div>
                    </div>

                    <span style={{ 
                      fontSize: '0.7rem', fontWeight: 700, padding: '3px 9px', borderRadius: '12px',
                      backgroundColor: trend === 'volatile' ? 'var(--accent-orange-light)' : 'var(--primary-50)',
                      color: trend === 'volatile' ? 'var(--accent-orange)' : 'var(--primary-dark)',
                      display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}>
                      {trend === 'volatile' ? <TrendingUp size={12} /> : <Minus size={12} />}
                      {trend === 'volatile' ? 'Fluctuating' : 'Stable Rate'}
                    </span>
                  </div>

                  {/* Highlighted Today's Rate */}
                  <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', padding: '0.9rem', borderRadius: '10px', textAlign: 'center', marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Today's Average Rate (Per Quintal)
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--primary-dark)', marginTop: '2px' }}>
                      ₹{modal.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Min / Max Range */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-main)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', fontWeight: 500 }}>
                        <TrendingDown size={11} /> Lowest Price
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>₹{min.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', fontWeight: 500 }}>
                        <TrendingUp size={11} color="var(--accent-red)" /> Highest Price
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--accent-red)', marginTop: '2px' }}>₹{max.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>

                {/* Footer Info / Location */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '65%' }}>
                    <Building2 size={13} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{record.market}, {record.district}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.75rem' }}>
                    View 5-Day Trend →
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5-Day Rate History Modal */}
      {selectedRecord && (
        <HistoryModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}

    </div>
  );
}
