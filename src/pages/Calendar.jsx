import React, { useEffect, useState, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, 
  Clock, CheckCircle2, Circle, AlertCircle, ArrowRight, Calculator,
  Sprout, RefreshCw, X, Check, Layers, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI, sectionsAPI } from '../api/client';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const CROP_TEMPLATES = {
  paddy: [
    { title: 'Land Preparation', stage: 'Preparation', days_offset: 0,  reminder: 3, estimated_cost: 3000 },
    { title: 'Seed Sowing',      stage: 'Sowing',      days_offset: 7,  reminder: 2, estimated_cost: 1500 },
    { title: 'Transplanting',    stage: 'Transplanting',days_offset: 30, reminder: 3, estimated_cost: 4000 },
    { title: 'Fertilizer – 1st Dosage', stage: 'Nutrition',   days_offset: 45, reminder: 2, estimated_cost: 2000 },
    { title: 'Pesticide Spray',  stage: 'Protection',  days_offset: 60, reminder: 2, estimated_cost: 1200 },
    { title: 'Fertilizer – 2nd Dosage', stage: 'Nutrition',   days_offset: 75, reminder: 2, estimated_cost: 2000 },
    { title: 'Harvesting',       stage: 'Harvest',     days_offset: 120,reminder: 5, estimated_cost: 6000 },
  ],
  wheat: [
    { title: 'Field Preparation',stage: 'Preparation', days_offset: 0,  reminder: 3, estimated_cost: 2500 },
    { title: 'Seed Sowing',      stage: 'Sowing',      days_offset: 5,  reminder: 2, estimated_cost: 1800 },
    { title: 'Irrigation – 1st', stage: 'Irrigation',  days_offset: 20, reminder: 1, estimated_cost: 500  },
    { title: 'Fertilizer Application', stage: 'Nutrition', days_offset: 35, reminder: 2, estimated_cost: 1800 },
    { title: 'Irrigation – 2nd', stage: 'Irrigation',  days_offset: 50, reminder: 1, estimated_cost: 500  },
    { title: 'Harvesting',       stage: 'Harvest',     days_offset: 120,reminder: 5, estimated_cost: 5000 },
  ],
  sugarcane: [
    { title: 'Planting Sets',    stage: 'Planting',    days_offset: 0,  reminder: 3, estimated_cost: 8000 },
    { title: 'Fertilizer – 1st Dosage', stage: 'Nutrition', days_offset: 30, reminder: 2, estimated_cost: 2500 },
    { title: 'Weeding & Earthing Up', stage: 'Maintenance', days_offset: 45, reminder: 2, estimated_cost: 3000 },
    { title: 'Fertilizer – 2nd Dosage', stage: 'Nutrition', days_offset: 90, reminder: 2, estimated_cost: 2500 },
    { title: 'Harvesting',       stage: 'Harvest',     days_offset: 300,reminder: 7, estimated_cost: 10000},
  ],
  cotton: [
    { title: 'Land Preparation', stage: 'Preparation', days_offset: 0,  reminder: 3, estimated_cost: 2000 },
    { title: 'Seed Sowing',      stage: 'Sowing',      days_offset: 7,  reminder: 2, estimated_cost: 2000 },
    { title: 'Pesticide Spray',  stage: 'Protection',  days_offset: 40, reminder: 2, estimated_cost: 1500 },
    { title: 'Fertilizer Application', stage: 'Nutrition', days_offset: 55, reminder: 2, estimated_cost: 2000 },
    { title: 'Picking – 1st Pass', stage: 'Harvest',    days_offset: 150,reminder: 5, estimated_cost: 4000 },
    { title: 'Picking – 2nd Pass', stage: 'Harvest',    days_offset: 165,reminder: 5, estimated_cost: 4000 },
  ],
};

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
}

/* Crop Template Generator Modal */
const TemplateModal = ({ visible, sections, onClose, onApply }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('paddy');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (sections.length > 0 && !selectedSection) setSelectedSection(sections[0].id);
  }, [sections, selectedSection]);

  if (!visible) return null;

  const handleApply = async () => {
    if (!selectedSection) { alert('Please select a farm section first'); return; }
    setApplying(true);
    try {
      await onApply(selectedSection, selectedCrop, startDate);
      onClose();
    } catch (_) {
      alert('Failed to apply crop schedule template');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#ffffff', borderRadius: '16px', maxWidth: '540px', width: '100%',
        padding: '1.75rem', boxShadow: 'var(--shadow-lg)'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sprout color="var(--primary-color)" size={20} /> Generate Crop Schedule
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>1. Select Crop Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {Object.keys(CROP_TEMPLATES).map(c => (
                <button key={c} onClick={() => setSelectedCrop(c)} style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer',
                  border: selectedCrop === c ? '1.5px solid var(--primary-color)' : '1px solid var(--border-color)',
                  background: selectedCrop === c ? 'var(--primary-color)' : '#ffffff',
                  color: selectedCrop === c ? '#ffffff' : 'var(--text-dark)', fontWeight: selectedCrop === c ? 600 : 500
                }}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>2. Select Farm Section</label>
            <select value={selectedSection || ''} onChange={e => setSelectedSection(e.target.value)} style={{ width: '100%', marginTop: '6px' }}>
              {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>3. Start / Planting Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', marginTop: '6px' }} />
          </div>

          <div style={{ background: 'var(--primary-50)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--primary-100)', fontSize: '0.825rem', color: 'var(--primary-dark)', fontWeight: 500 }}>
            This template will automatically create <strong>{CROP_TEMPLATES[selectedCrop].length} task reminders</strong> covering Preparation, Sowing, Nutrition, and Harvesting.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
            <button onClick={onClose} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleApply} disabled={applying} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {applying ? <RefreshCw className="spin" size={16} /> : <Check size={16} />}
              <span>{applying ? 'Generating Tasks...' : 'Apply Schedule'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

/* Date Calculator Modal */
const DateCalculatorModal = ({ visible, onClose, sections, onSaveTask }) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationValue, setDurationValue] = useState('');
  const [durationType, setDurationType] = useState('days');
  const [reminderDays, setReminderDays] = useState('3');
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedSection, setSelectedSection] = useState(sections[0]?.id || '');

  useEffect(() => {
    if (sections.length > 0 && !selectedSection) setSelectedSection(sections[0].id);
  }, [sections, selectedSection]);

  if (!visible) return null;

  let targetDateStr = startDate;
  if (durationValue && !isNaN(durationValue)) {
    const val = parseInt(durationValue, 10);
    const d = new Date(startDate);
    if (durationType === 'days') d.setDate(d.getDate() + val);
    else if (durationType === 'weeks') d.setDate(d.getDate() + (val * 7));
    else if (durationType === 'months') d.setMonth(d.getMonth() + val);
    targetDateStr = d.toISOString().split('T')[0];
  }

  const handleSave = () => {
    if (!taskTitle) { alert('Please enter a task note / title'); return; }
    if (!selectedSection) { alert('Please select a farm section'); return; }
    onSaveTask({
      title: taskTitle,
      due_date: targetDateStr,
      reminder_days_before: parseInt(reminderDays, 10) || 3,
      section_id: selectedSection
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#ffffff', borderRadius: '16px', maxWidth: '540px', width: '100%',
        padding: '1.75rem', boxShadow: 'var(--shadow-lg)'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator color="var(--primary-color)" size={20} /> Farming Date Calculator
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', marginTop: '4px' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Add Duration</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <input type="number" min="1" placeholder="Duration e.g. 15" value={durationValue} onChange={e => setDurationValue(e.target.value)} style={{ flex: 1 }} />
              {['days', 'weeks', 'months'].map(t => (
                <button key={t} onClick={() => setDurationType(t)} style={{
                  padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer',
                  border: durationType === t ? '1.5px solid var(--primary-color)' : '1px solid var(--border-color)',
                  background: durationType === t ? 'var(--primary-color)' : '#ffffff',
                  color: durationType === t ? '#ffffff' : 'var(--text-dark)', fontWeight: durationType === t ? 600 : 500
                }}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--primary-50)', padding: '12px', borderRadius: '10px', borderLeft: '4px solid var(--primary-color)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase' }}>Calculated Target Date</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '2px' }}>
              {formatDate(targetDateStr)}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Task Title / Note *</label>
            <input type="text" placeholder="e.g. 2nd Irrigation Stage" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} style={{ width: '100%', marginTop: '4px' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Farm Section *</label>
            <select value={selectedSection || ''} onChange={e => setSelectedSection(e.target.value)} style={{ width: '100%', marginTop: '4px' }}>
              {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
            <button onClick={onClose} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> Save Calculated Task
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function Calendar() {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showTemplate, setShowTemplate] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

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
      console.error('Calendar data fetch error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Index tasks by date YYYY-MM-DD
  const tasksByDate = {};
  tasks.forEach(t => {
    const d = t.due_date ? t.due_date.split('T')[0] : null;
    if (d) { tasksByDate[d] = tasksByDate[d] || []; tasksByDate[d].push(t); }
  });

  const dayStr = (day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const todayStr = today.toISOString().split('T')[0];
  const selectedTasks = selectedDay ? (tasksByDate[dayStr(selectedDay)] || []) : [];

  // Upcoming tasks in next 7 days
  const upcoming = tasks.filter(t => {
    if (!t.due_date || t.status === 'done' || t.status === 'cancelled') return false;
    const d = new Date(t.due_date);
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  const applyTemplate = async (sectionId, cropType, startDate) => {
    const tpl = CROP_TEMPLATES[cropType] || [];
    for (const step of tpl) {
      await tasksAPI.createTask({
        section_id: parseInt(sectionId),
        title: step.title,
        description: `${cropType} schedule – ${step.stage} stage`,
        due_date: addDays(startDate, step.days_offset),
        reminder_days_before: step.reminder,
        crop_type: cropType,
        stage: step.stage,
        estimated_cost: step.estimated_cost,
      });
    }
    fetchData();
  };

  const saveCalculatedTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      fetchData();
    } catch (_) {}
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Controls Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarIcon size={24} color="var(--primary-color)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
              Crop Operation Calendar
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Visual schedule of farming operations and automated crop templates
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowCalculator(true)} style={{ background: '#ffffff', border: '1px solid var(--border-color)', color: 'var(--text-dark)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <Calculator size={15} color="var(--primary-color)" />
            <span>Date Calculator</span>
          </button>
          <button onClick={() => setShowTemplate(true)} style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', color: 'var(--primary-dark)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
            <Sprout size={15} color="var(--primary-dark)" />
            <span>Apply Crop Schedule</span>
          </button>
          <button onClick={() => navigate('/task-reminders')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <Plus size={15} />
            <span>Task Manager</span>
          </button>
        </div>
      </div>

      {/* Upcoming Reminders Alert */}
      {upcoming.length > 0 && (
        <div style={{ background: 'var(--accent-orange-light)', border: '1px solid #fed7aa', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', color: 'var(--accent-orange)' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            You have {upcoming.length} task{upcoming.length > 1 ? 's' : ''} scheduled in the next 7 days.
          </div>
        </div>
      )}

      {/* Month Calendar Grid */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        
        {/* Month Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <button onClick={prevMonth} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '8px', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ChevronLeft size={18} /> Prev Month
          </button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '8px', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Next Month <ChevronRight size={18} />
          </button>
        </div>

        {/* Days Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {DAYS.map(d => <div key={d} style={{ padding: '6px 0' }}>{d}</div>)}
        </div>

        {/* Days Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {Array(firstDayOfWeek).fill(null).map((_, i) => (
            <div key={`empty-${i}`} style={{ minHeight: '64px', background: 'transparent' }} />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const ds = dayStr(day);
            const dayTasks = tasksByDate[ds] || [];
            const isToday = ds === todayStr;
            const isSelected = selectedDay === day;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                style={{
                  minHeight: '68px', padding: '6px', borderRadius: '10px', cursor: 'pointer',
                  border: isSelected ? '2px solid var(--primary-color)' : isToday ? '1.5px solid var(--primary-color)' : '1px solid var(--border-color)',
                  background: isSelected ? 'var(--primary-color)' : isToday ? 'var(--primary-50)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-dark)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ fontWeight: isToday || isSelected ? 800 : 500, fontSize: '0.875rem' }}>
                  {day}
                </div>

                {dayTasks.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, padding: '1px 4px', borderRadius: '4px', background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--primary-50)', color: isSelected ? '#fff' : 'var(--primary-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {dayTasks.length} Task{dayTasks.length > 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Section */}
      {selectedDay !== null && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.85rem' }}>
            Tasks Scheduled for {selectedDay} {MONTHS[month]} {year}
          </h3>

          {selectedTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No tasks scheduled on this date.
              <button 
                onClick={() => navigate('/task-reminders', { state: { preselectedDate: dayStr(selectedDay) } })}
                style={{ marginLeft: '10px', background: 'var(--primary-50)', color: 'var(--primary-dark)', border: '1px solid var(--primary-100)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add Task for This Day
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {selectedTasks.map(t => (
                <div key={t.id} style={{ padding: '10px 12px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-dark)' }}>{t.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                      {t.section_name && <span>Section: {t.section_name}</span>}
                      {t.crop_type && <span>Crop: {t.crop_type}</span>}
                    </div>
                  </div>
                  <button onClick={() => navigate('/task-reminders')} style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}>
                    View Task
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <TemplateModal visible={showTemplate} sections={sections} onClose={() => setShowTemplate(false)} onApply={applyTemplate} />
      <DateCalculatorModal visible={showCalculator} sections={sections} onClose={() => setShowCalculator(false)} onSaveTask={saveCalculatedTask} />

    </div>
  );
}
