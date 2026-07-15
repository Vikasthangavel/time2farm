import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, X, TrendingUp, TrendingDown, MapPin, ChevronDown, 
  RefreshCw, AlertCircle, CheckCircle, Minus, Store, Calendar
} from 'lucide-react';
import { mandiAPI, POPULAR_COMMODITIES, INDIAN_STATES, userAPI } from '../api/client';

/* Commodity Emoji Map */
const COMMODITY_EMOJI = {
  Tomato: '🍅', Onion: '🧅', Potato: '🥔', Rice: '🌾', Wheat: '🌾',
  Maize: '🌽', Cotton: '🏵️', Groundnut: '🥜', Soyabean: '🫘',
  Turmeric: '🟡', Chilli: '🌶️', Garlic: '🧄', Ginger: '🫚',
  Banana: '🍌', Mango: '🥭', Sugarcane: '🎋', Coconut: '🥥',
  Brinjal: '🍆', Cabbage: '🥬', Cauliflower: '🥦',
};

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

  // Generate 5-day simulated history matching mobile app logic
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
  const emoji = COMMODITY_EMOJI[record.commodity] || '🌿';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '16px', maxWidth: '520px', width: '100%',
        padding: '1.5rem', boxShadow: 'var(--shadow-lg)', animation: 'slideUp 0.25s ease-out'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{emoji}</span>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                {record.commodity} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>({record.variety || 'Local'})</span>
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <MapPin size={13} /> {record.market}, {record.district}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--primary-50)', color: 'var(--text-dark)', padding: '6px', borderRadius: '50%', border: 'none' }}>
            <X size={18} />
          </button>
        </div>

        {/* Rate summary */}
        <div style={{ background: 'var(--primary-50)', padding: '1rem 1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-dark)', textTransform: 'uppercase' }}>Today's Modal Rate</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-dark)' }}>₹{baseModal.toLocaleString('en-IN')}<span style={{ fontSize: '0.85rem', fontWeight: 500 }}> / quintal</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px',
              backgroundColor: pctChange >= 0 ? 'rgba(74,158,63,0.15)' : 'rgba(217,64,64,0.15)',
              color: pctChange >= 0 ? 'var(--primary-dark)' : 'var(--accent-red)', fontWeight: 700, fontSize: '0.85rem'
            }}>
              {pctChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {pctChange >= 0 ? '+' : ''}{pctChange}%
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>5-day trend</div>
          </div>
        </div>

        {/* 5-day table */}
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-dark)' }}>Daily Rate History</h4>
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', padding: '8px 12px', background: 'var(--bg-main)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <div>Date</div>
            <div style={{ textAlign: 'center' }}>Lowest</div>
            <div style={{ textAlign: 'center', color: 'var(--primary-dark)' }}>Modal</div>
            <div style={{ textAlign: 'center' }}>Highest</div>
          </div>
          {[...history].reverse().map((h, idx) => (
            <div key={idx} style={{ 
              display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', padding: '10px 12px', 
              borderTop: '1px solid var(--border-color)', fontSize: '0.85rem',
              background: idx === 0 ? 'var(--primary-50)' : '#fff'
            }}>
              <div style={{ fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? 'var(--primary-dark)' : 'var(--text-dark)' }}>{h.date}</div>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>₹{h.min.toLocaleString('en-IN')}</div>
              <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary-dark)' }}>₹{h.modal.toLocaleString('en-IN')}</div>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>₹{h.max.toLocaleString('en-IN')}</div>
            </div>
          ))}
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
      
      {/* Header Banner */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%)', 
        color: '#fff', padding: '1.5rem', borderRadius: '16px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Store size={22} />
              <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>Mandi Prices</h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
              Live market commodity rates powered by AGMARKNET
            </p>
          </div>
          {records.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              {records.length} Markets Found
            </div>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        
        {/* State & District Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>State</label>
            <div style={{ position: 'relative' }}>
              <select 
                value={state} 
                onChange={(e) => setState(e.target.value)}
                style={{ appearance: 'none', paddingRight: '2.2rem' }}
              >
                <option value="">All India</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>District (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="e.g. Salem, Namakkal"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doFetch()}
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
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', height: '42px' }}
            >
              {loading ? <RefreshCw className="spin" size={16} /> : <Search size={16} />}
              <span>Search Rates</span>
            </button>
          </div>
        </div>

        {/* Location auto-detected helper */}
        {(autoState || autoDistrict) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: 'var(--primary-50)', padding: '6px 12px', borderRadius: '8px', color: 'var(--primary-dark)' }}>
            <CheckCircle size={14} />
            <span>Profile Location: <strong>{[autoDistrict, autoState].filter(Boolean).join(', ')}</strong></span>
            {(state !== autoState || district !== autoDistrict) && (
              <button 
                onClick={handleResetLocation} 
                style={{ marginLeft: 'auto', background: 'var(--primary-color)', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}
              >
                Reset to My Location
              </button>
            )}
          </div>
        )}

        {/* Commodity Selector Chips */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
            Popular Crops
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
                    padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem',
                    border: active ? '1.5px solid var(--primary-color)' : '1px solid var(--border-color)',
                    background: active ? 'var(--primary-color)' : '#fff',
                    color: active ? '#fff' : 'var(--text-dark)',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <span>{COMMODITY_EMOJI[c] || '🌿'}</span>
                  <span>{c}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Main Results Container */}
      {loading ? (
        <div className="card flex-center" style={{ padding: '4rem', flexDirection: 'column', gap: '1rem' }}>
          <RefreshCw className="spin" size={32} style={{ color: 'var(--primary-color)' }} />
          <div style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Fetching latest Mandi rates from AGMARKNET...</div>
        </div>
      ) : error ? (
        <div className="card flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
          <AlertCircle size={40} style={{ color: 'var(--accent-red)' }} />
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Unable to load mandi prices</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{error}</div>
          <button onClick={() => doFetch()} style={{ marginTop: '0.5rem' }}>Try Again</button>
        </div>
      ) : !searched ? (
        <div className="card flex-center" style={{ padding: '4rem 2rem', flexDirection: 'column', gap: '0.75rem', textAlign: 'center' }}>
          <Store size={48} style={{ color: 'var(--primary-light)', opacity: 0.8 }} />
          <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>Select a Crop or Location above</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px' }}>
            View real-time prices per quintal (100 kg) across agricultural markets in India.
          </div>
        </div>
      ) : records.length === 0 ? (
        <div className="card flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
          <Search size={36} style={{ color: 'var(--text-muted)' }} />
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>No price records found</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try clearing the district filter or selecting a different crop.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {records.map((record, index) => {
            const modal = parseFloat(record.modal_price) || 0;
            const min = parseFloat(record.min_price) || 0;
            const max = parseFloat(record.max_price) || 0;
            const trend = getPriceTrend(min, max);
            const emoji = COMMODITY_EMOJI[record.commodity] || '🌿';

            return (
              <div 
                key={index} 
                className="card hoverable" 
                onClick={() => setSelectedRecord(record)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}
              >
                <div>
                  {/* Top Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.75rem' }}>{emoji}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)' }}>{record.commodity}</div>
                        {record.variety && record.variety !== 'Other' && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{record.variety}</div>
                        )}
                      </div>
                    </div>
                    <span style={{ 
                      fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px',
                      backgroundColor: trend === 'volatile' ? 'var(--accent-orange-light)' : 'var(--primary-50)',
                      color: trend === 'volatile' ? 'var(--accent-orange)' : 'var(--primary-dark)',
                      display: 'inline-flex', alignItems: 'center', gap: '3px'
                    }}>
                      {trend === 'volatile' ? <TrendingUp size={12} /> : <Minus size={12} />}
                      {trend === 'volatile' ? 'Volatile' : 'Stable'}
                    </span>
                  </div>

                  {/* Modal Price Highlight */}
                  <div style={{ background: 'var(--primary-50)', padding: '0.85rem', borderRadius: '10px', textAlign: 'center', marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Today's Rate (per quintal)
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-dark)' }}>
                      ₹{modal.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Min / Max Range */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-main)', padding: '8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                        <TrendingDown size={11} /> Lowest
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>₹{min.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                        <TrendingUp size={11} color="var(--accent-red)" /> Highest
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--accent-red)' }}>₹{max.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>

                {/* Footer / Location */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '70%' }}>
                    <MapPin size={13} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{record.market}, {record.district}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.72rem' }}>
                    📈 History
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History Modal */}
      {selectedRecord && (
        <HistoryModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}

    </div>
  );
}
