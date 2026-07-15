import React, { useEffect, useState, useCallback } from 'react';
import { 
  Bell, Plus, X, CheckCircle2, Circle, Clock, AlertCircle, 
  Trash2, CalendarDays, DollarSign, Sprout, Filter, RefreshCw, 
  Edit3, Calendar as CalendarIcon, Check, RotateCcw, Play
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tasksAPI, sectionsAPI } from '../api/client';

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Pending',     color: 'var(--accent-orange)', bg: 'var(--accent-orange-light)' },
  { value: 'in_progress', label: 'In Progress', color: '#0284c7', bg: '#e0f2fe' },
  { value: 'done',        label: 'Completed',   color: 'var(--primary-color)', bg: 'var(--primary-50)' },
  { value: 'cancelled',   label: 'Cancelled',   color: 'var(--text-muted)', bg: 'var(--bg-main)' },
];

const FARM_CATEGORIES = ['Dairy / Cattle', 'Poultry', 'Crops', 'Equipment', 'General Farm'];
const OPERATION_STAGES = [
  'Vaccination', 'Feeding', 'Milking', 'Breeding', 'Deworming',
  'Preparation', 'Sowing', 'Irrigation', 'Nutrition', 'Protection',
  'Maintenance', 'Harvest'
];
const FILTER_OPTIONS = ['all', 'pending', 'in_progress', 'done'];

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  const diff = (target - now) / (1000 * 60 * 60 * 24);
  return Math.round(diff);
}

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* Modal for Creating & Editing Tasks */
const TaskModal = ({ visible, onClose, onSaved, sections, editTask, defaultDate }) => {
  const [sectionId, setSectionId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderDays, setReminderDays] = useState('3');
  const [cropType, setCropType] = useState('');
  const [stage, setStage] = useState('');
  const [cost, setCost] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editTask) {
      setSectionId(String(editTask.section_id || ''));
      setTitle(editTask.title || '');
      setDescription(editTask.description || '');
      setDueDate((editTask.due_date || '').split('T')[0]);
      setReminderDays(String(editTask.reminder_days_before || 3));
      setCropType(editTask.crop_type || '');
      setStage(editTask.stage || '');
      setCost(String(editTask.estimated_cost || ''));
    } else {
      setSectionId(sections[0]?.id ? String(sections[0].id) : '');
      setTitle(''); setDescription('');
      setDueDate(defaultDate || new Date().toISOString().split('T')[0]);
      setReminderDays('3'); setCropType(''); setStage(''); setCost('');
    }
    setError(null);
  }, [editTask, visible, sections, defaultDate]);

  if (!visible) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Please enter a task title'); return; }
    if (!dueDate) { setError('Please select a due date'); return; }
    if (!sectionId) { setError('Please select a farm section'); return; }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        section_id: parseInt(sectionId),
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate,
        reminder_days_before: parseInt(reminderDays) || 3,
        crop_type: cropType.trim(),
        stage: stage.trim(),
        estimated_cost: parseFloat(cost) || 0,
      };
      if (editTask) {
        await tasksAPI.updateTask(editTask.id, payload);
      } else {
        await tasksAPI.createTask(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#ffffff', borderRadius: '16px', maxWidth: '580px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', boxShadow: 'var(--shadow-lg)'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
            {editTask ? 'Edit Task Reminder' : 'Create New Task'}
          </h3>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(217,64,64,0.1)', color: 'var(--accent-red)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Farm Section *</label>
            <select value={sectionId} onChange={e => setSectionId(e.target.value)} required style={{ width: '100%', marginTop: '4px' }}>
              <option value="" disabled>Select Farm Section</option>
              {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Task Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Cattle Vaccination / Milk Processing / Fertilizer Spray" required style={{ width: '100%', marginTop: '4px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Due Date *</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required style={{ width: '100%', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Remind Days Before</label>
              <input type="number" min="0" max="30" value={reminderDays} onChange={e => setReminderDays(e.target.value)} style={{ width: '100%', marginTop: '4px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Farm Category / Type (Optional)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', marginBottom: '8px' }}>
              {FARM_CATEGORIES.map(c => (
                <button type="button" key={c} onClick={() => setCropType(cropType === c ? '' : c)}
                  style={{
                    padding: '5px 12px', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer',
                    border: cropType === c ? '1.5px solid var(--primary-color)' : '1px solid var(--border-color)',
                    background: cropType === c ? 'var(--primary-color)' : '#fff',
                    color: cropType === c ? '#fff' : 'var(--text-dark)', fontWeight: cropType === c ? 600 : 500
                  }}>
                  {c}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              value={cropType} 
              onChange={e => setCropType(e.target.value)} 
              placeholder="Or type custom category (e.g. Dairy, Goat Farm, Wheat)" 
              style={{ width: '100%', fontSize: '0.85rem' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Operation / Stage (Optional)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', marginBottom: '8px' }}>
              {OPERATION_STAGES.map(s => (
                <button type="button" key={s} onClick={() => setStage(stage === s ? '' : s)}
                  style={{
                    padding: '4px 10px', borderRadius: '16px', fontSize: '0.78rem', cursor: 'pointer',
                    border: stage === s ? '1.5px solid var(--primary-color)' : '1px solid var(--border-color)',
                    background: stage === s ? 'var(--primary-50)' : '#fff',
                    color: stage === s ? 'var(--primary-dark)' : 'var(--text-dark)', fontWeight: stage === s ? 700 : 500
                  }}>
                  {s}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              value={stage} 
              onChange={e => setStage(e.target.value)} 
              placeholder="Or type custom stage (e.g. Morning Milking, Deworming)" 
              style={{ width: '100%', fontSize: '0.85rem' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Estimated Cost (₹)</label>
              <input type="number" min="0" placeholder="0" value={cost} onChange={e => setCost(e.target.value)} style={{ width: '100%', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Notes / Description</label>
              <input type="text" placeholder="Optional notes" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', marginTop: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-dark)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {saving ? <RefreshCw className="spin" size={16} /> : null}
              <span>{editTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default function TaskReminders() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedDate = location.state?.preselectedDate || null;

  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRes, secRes] = await Promise.all([
        tasksAPI.getTasks(),
        sectionsAPI.getSections(),
      ]);
      if (taskRes.success) setTasks(taskRes.tasks || []);
      if (secRes.success) setSections(secRes.sections || []);
    } catch (e) {
      console.error('Fetch task error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (preselectedDate) setShowModal(true);
  }, [fetchData, preselectedDate]);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (e) {
      alert('Could not update task status');
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return;
    try {
      await tasksAPI.deleteTask(task.id);
      setTasks(prev => prev.filter(t => t.id !== task.id));
    } catch (_) {}
  };

  const filtered = tasks.filter(t => filter === 'all' || t.status === filter);
  const forecastTotal = filtered.reduce((s, t) => s + (parseFloat(t.estimated_cost) || 0), 0);
  const pendingTotal  = filtered.filter(t => t.status !== 'done' && t.status !== 'cancelled')
                                .reduce((s, t) => s + (parseFloat(t.estimated_cost) || 0), 0);

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={24} color="var(--primary-color)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
              Farm Task Reminders
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Simple task list with 1-click status updates for daily farm operations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/calendar')} style={{ background: '#ffffff', border: '1px solid var(--border-color)', color: 'var(--text-dark)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <CalendarIcon size={16} color="var(--primary-color)" />
            <span>Calendar View</span>
          </button>
          <button onClick={() => { setEditTask(null); setShowModal(true); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      {filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid var(--primary-color)', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-50)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Forecast Total Cost</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-dark)' }}>₹{forecastTotal.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid var(--accent-orange)', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-orange-light)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Pending Task Cost</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-orange)' }}>₹{pendingTotal.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto' }}>
        <Filter size={16} color="var(--text-muted)" />
        {FILTER_OPTIONS.map(f => {
          const count = f === 'all' ? tasks.length : tasks.filter(t => t.status === f).length;
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '0.825rem',
              border: active ? '1.5px solid var(--primary-color)' : '1px solid var(--border-color)',
              background: active ? 'var(--primary-color)' : '#ffffff',
              color: active ? '#ffffff' : 'var(--text-dark)', fontWeight: active ? 600 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap'
            }}>
              {f === 'all' ? 'All Tasks' : f.replace('_', ' ').toUpperCase()} ({count})
            </button>
          );
        })}
      </div>

      {/* Simple & Easy Task List */}
      {loading ? (
        <div className="card flex-center" style={{ padding: '4rem', flexDirection: 'column', gap: '1rem' }}>
          <RefreshCw className="spin" size={32} style={{ color: 'var(--primary-color)' }} />
          <div style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Loading farm tasks...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex-center" style={{ padding: '4rem 2rem', flexDirection: 'column', gap: '0.85rem', textAlign: 'center' }}>
          <Sprout size={48} style={{ color: 'var(--primary-light)' }} />
          <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-dark)' }}>No tasks in this list</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '400px' }}>
            Click "+ Add New Task" or apply a crop template from the calendar.
          </div>
          <button onClick={() => { setEditTask(null); setShowModal(true); }} style={{ marginTop: '0.5rem' }}>Create First Task</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(task => {
            const days = daysUntil(task.due_date);
            const isOverdue = days !== null && days < 0 && task.status !== 'done';
            const statusConfig = STATUS_OPTIONS.find(s => s.value === task.status) || STATUS_OPTIONS[0];

            return (
              <div key={task.id} className="card" style={{
                margin: 0, padding: '1.25rem',
                borderLeft: isOverdue ? '5px solid var(--accent-red)' : `5px solid ${statusConfig.color}`,
                background: task.status === 'done' ? '#f8fafc' : '#ffffff',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {/* Task Header & Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{
                        fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0,
                        textDecoration: task.status === 'done' ? 'line-through' : 'none',
                        opacity: task.status === 'done' ? 0.75 : 1
                      }}>
                        {task.title}
                      </h3>
                      
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px',
                        backgroundColor: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.color}40`
                      }}>
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Metadata tags */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.825rem', marginTop: '6px' }}>
                      {task.status === 'done' ? (
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500,
                          color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '6px'
                        }}>
                          <CalendarDays size={14} />
                          {fmtDate(task.due_date)}
                        </span>
                      ) : (
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: isOverdue ? 700 : 600,
                          color: isOverdue ? 'var(--accent-red)' : (days !== null && days <= 3 && days >= 0) ? 'var(--accent-orange)' : 'var(--text-dark)',
                          background: isOverdue ? 'rgba(217,64,64,0.1)' : 'var(--bg-main)', padding: '2px 8px', borderRadius: '6px'
                        }}>
                          <CalendarDays size={14} />
                          {fmtDate(task.due_date)}
                          {days !== null && (
                            isOverdue ? ` (${Math.abs(days)}d Overdue)` : days === 0 ? ' (Due Today!)' : days > 0 ? ` (${days}d remaining)` : ''
                          )}
                        </span>
                      )}

                      {task.section_name && (
                        <span style={{ background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-dark)' }}>
                          Section: {task.section_name}
                        </span>
                      )}

                      {task.crop_type && (
                        <span style={{ background: 'var(--primary-50)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          Crop: {task.crop_type}
                        </span>
                      )}

                      {task.stage && (
                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          Stage: {task.stage}
                        </span>
                      )}
                    </div>
                  </div>

                  {task.estimated_cost > 0 && (
                    <div style={{ textAlign: 'right', background: 'var(--bg-main)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Est. Cost</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)' }}>₹{Number(task.estimated_cost).toLocaleString('en-IN')}</div>
                    </div>
                  )}
                </div>

                {task.description && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '8px 12px', borderRadius: '8px', marginBottom: '1rem' }}>
                    {task.description}
                  </div>
                )}

                {/* Direct 1-Click Status Change Buttons Panel */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>Change Status:</span>

                    {task.status !== 'done' && (
                      <button 
                        onClick={() => updateStatus(task.id, 'done')}
                        style={{ background: 'var(--primary-color)', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Check size={15} /> Mark Complete
                      </button>
                    )}

                    {task.status !== 'in_progress' && task.status !== 'done' && (
                      <button 
                        onClick={() => updateStatus(task.id, 'in_progress')}
                        style={{ background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '6px 14px', borderRadius: '8px', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Play size={13} fill="#0284c7" /> Mark In Progress
                      </button>
                    )}

                    {task.status === 'done' && (
                      <button 
                        onClick={() => updateStatus(task.id, 'pending')}
                        style={{ background: 'var(--accent-orange-light)', color: 'var(--accent-orange)', border: '1px solid #fed7aa', padding: '6px 14px', borderRadius: '8px', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <RotateCcw size={14} /> Reopen Task
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => { setEditTask(task); setShowModal(true); }} style={{ background: 'var(--bg-main)', color: 'var(--text-dark)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Edit3 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(task)} style={{ background: 'rgba(217,64,64,0.1)', color: 'var(--accent-red)', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <TaskModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSaved={fetchData}
        sections={sections}
        editTask={editTask}
        defaultDate={preselectedDate}
      />

    </div>
  );
}
