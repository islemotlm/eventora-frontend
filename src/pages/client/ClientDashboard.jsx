import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import Modal from '../../components/Modal';
import SkeletonCard from '../../components/SkeletonCard';
import EmptyState from '../../components/EmptyState';
import api from '../../utils/axios';
import { formatDate } from '../../utils/formatters';
import useAuthStore from '../../store/authStore';
import { getInitials } from '../../utils/formatters';
import CreateEvent from './CreateEvent';
import PlanSelection from './PlanSelection';
import PaymentPage from './PaymentPage';
import PaymentStatus from './PaymentStatus';

// ── Icons ───────────────────────────────────────────────────────────────────
function IconCalendar({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconPlus({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IconUsers({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconStar({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function IconBarChart({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}
function IconReceipt({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function IconBell({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function IconSearch({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconPin({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const SIDEBAR_LINKS = [
  { to: '/client', end: true, icon: <IconCalendar />, label: 'My Events' },
  { to: '/client/create', icon: <IconPlus />, label: 'Create Event' },
  { to: '/client/speakers', icon: <IconUsers />, label: 'Speakers' },
  { to: '/client/sponsors', icon: <IconStar />, label: 'Sponsors' },
  { to: '/client/organizers', icon: <IconUsers />, label: 'Organizers' },
  { to: '/client/payments', icon: <IconReceipt />, label: 'Payments' },
  { to: '/client/stats', icon: <IconBarChart />, label: 'Statistics' },
];

// ── Sidebar ─────────────────────────────────────────────────────────────────
function ClientSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <aside className="w-60 min-h-screen sidebar-glass flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[rgba(124,58,237,0.08)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
            E
          </div>
          <span className="font-extrabold text-lg text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>Eventora</span>
        </div>
        {/* User identity */}
        <div className="mt-4 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-primary/[0.06] border border-primary/[0.1]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
            {getInitials(user)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-xs text-gray-900 truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-[10px] text-primary/70 font-semibold uppercase tracking-wide">Event Lead</p>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {SIDEBAR_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="text-base">{link.icon}</span>
            <span className="text-sm">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      {/* Logout */}
      <div className="px-3 py-4 border-t border-[rgba(124,58,237,0.08)]">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="sidebar-link w-full text-gray-500 hover:text-red-600 hover:bg-red-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// ── Top Navbar ───────────────────────────────────────────────────────────────
function TopNavbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-[rgba(124,58,237,0.08)] flex items-center px-6 gap-4 shrink-0 sticky top-0 z-20">
      <div className="flex-1 relative max-w-lg">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search events, venues..."
          className="w-full bg-gray-50 border border-gray-200 rounded-pill pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <button className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <IconBell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role === 'client' ? 'Event Lead' : user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
            {getInitials(user)}
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            title="Sign Out"
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    approved: 'bg-green-500 text-white',
    pending: 'bg-orange-400 text-white',
    rejected: 'bg-danger text-white',
  };
  return (
    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${map[status] || 'bg-gray-400 text-white'}`}>
      {status}
    </span>
  );
}

// ── Require Payment Wrapper ──────────────────────────────────────────────────
// This component always fetches live payment status from the server.
// It is the single gatekeeper for the /client/create route.
function RequirePayment({ children }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'allowed' | 'redirecting'
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // The ?_t= timestamp makes every URL unique, bypassing any browser/proxy cache.
    // We do NOT send Cache-Control headers — they are not whitelisted in the
    // Django CORS config and would trigger a preflight failure.
    api.get('/api/payments/status/', { params: { _t: Date.now() } })
      .then(({ data }) => {
        if (!mounted) return;

        // Log the full response for debugging — visible in browser DevTools > Console
        console.log('[RequirePayment] Payment status response:', data);

        // Primary gate: the backend explicitly tells us whether event creation is allowed.
        // Fallback: reconstruct it from status + is_used in case of older backend versions.
        const canCreate = data.can_create_event ?? (data.status === 'approved' && !data.is_used);

        if (canCreate) {
          // ✅ Approved and unused — allow access to CreateEvent
          setStatus('allowed');
        } else if (data.status === 'pending') {
          // ⏳ Submitted but awaiting admin review
          toast('Your payment is still being reviewed. Hang tight!', { icon: '⏳' });
          setStatus('redirecting');
          navigate('/client/payment-status', { replace: true });
        } else if (data.status === 'approved' && data.is_used) {
          // ♻️ Approved but already consumed by a previous event
          toast.error('This payment was already used. Please select a new plan.');
          setStatus('redirecting');
          navigate('/client/plans', { replace: true });
        } else {
          // ❌ Rejected, or no qualifying payment
          toast.error('No active approved payment found. Please select a plan.');
          setStatus('redirecting');
          navigate('/client/plans', { replace: true });
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn('[RequirePayment] Status check failed:', err.response?.status, err.message);
        if (err.response?.status === 404) {
          // No payment record at all — first-time user
          toast('Please select a plan to get started.', { icon: '👋' });
        } else {
          toast.error('Could not verify payment status. Please try again.');
        }
        setStatus('redirecting');
        navigate('/client/plans', { replace: true });
      });

    return () => { mounted = false; };
  }, [navigate]);

  if (status === 'checking') {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Verifying payment access...</p>
        </div>
      </div>
    );
  }

  if (status !== 'allowed') return null;

  return children;
}

// ── My Events Page ───────────────────────────────────────────────────────────
const TABS = ['All Events', 'Pending', 'Approved', 'Rejected'];

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('All Events');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = useCallback(() => {
    api.get('/api/events/')
      .then(({ data }) => setEvents(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const filtered = tab === 'All Events'
    ? events
    : events.filter((e) => e.status === tab.toLowerCase());

  const handleDelete = async (id) => {
    try {
      const ev = events.find((e) => e.id === id);
      await api.delete(`/api/events/${ev.slug}/`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success('Event deleted');
    } catch { toast.error('Delete failed'); }
    setDeleteConfirm(null);
  };

  const CATEGORY_COLORS = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#f8f7ff]">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Events</h1>
          <p className="text-gray-500 mt-1">Manage and track your upcoming conferences and workshops.</p>
        </div>
        <button
          onClick={() => navigate('/client/create')}
          className="flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
        >
          <IconPlus className="w-4 h-4" />
          New Event
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 mt-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${tab === t
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {t}
            {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No events"
          message={tab === 'All Events' ? 'Create your first event to get started.' : `No ${tab.toLowerCase()} events.`}
          action={tab === 'All Events' && (
            <button onClick={() => navigate('/client/create')} className="btn-primary">Create Event</button>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((ev, idx) => {
            const capacity = ev.max_capacity > 0 ? Math.round((ev.registrations_count || 0) / ev.max_capacity * 100) : 0;
            const catColor = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(108,71,255,0.07)] hover:shadow-[0_8px_32px_rgba(108,71,255,0.13)] transition-all overflow-hidden flex"
              >
                {/* Image */}
                <div className="relative w-36 shrink-0">
                  {ev.logo ? (
                    <img src={ev.logo} alt={ev.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <IconCalendar className="w-10 h-10 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={ev.status} />
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catColor}`}>
                      {ev.category || 'Conference'}
                    </span>
                    <div className="flex -space-x-1.5">
                      {[...Array(Math.min(ev.registrations_count || 0, 3))].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" />
                      ))}
                      {(ev.registrations_count || 0) > 3 && (
                        <div className="w-6 h-6 rounded-full bg-primary text-white border-2 border-white flex items-center justify-center text-xs font-bold">
                          +{ev.registrations_count - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{ev.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <IconCalendar className="w-3.5 h-3.5" />
                      {formatDate(ev.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconPin />
                      {ev.location}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Capacity</span>
                      <span className="font-semibold text-gray-700">
                        {ev.registrations_count || 0} / {ev.max_capacity}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min(capacity, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Event" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-danger text-white rounded-pill py-2.5 font-semibold hover:opacity-90">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

// ── Speakers Page ────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const mediaUrl = (p) => { if (!p) return ''; return p.startsWith('http') ? p : `${API_BASE}${p}`; };

function SpeakersPage() {
  const [events, setEvents] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [cvImageFile, setCvImageFile] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    api.get('/api/events/').then(({ data }) => {
      const evs = data.results || data;
      setEvents(evs);
      if (evs.length > 0) setSelectedEvent(evs[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    setLoading(true);
    api.get(`/api/events/${selectedEvent}/speakers/`).then(({ data }) => setSpeakers(data.results || data)).finally(() => setLoading(false));
  }, [selectedEvent]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('first_name', data.first_name);
      fd.append('last_name', data.last_name);
      fd.append('title', data.title);
      if (cvImageFile) fd.append('cv_image', cvImageFile);
      if (data.schedule_time) fd.append('schedule_time', data.schedule_time);
      if (photoFile) fd.append('photo', photoFile);
      const res = await api.post(`/api/events/${selectedEvent}/speakers/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSpeakers((prev) => [...prev, res.data]);
      reset(); setPhotoFile(null); setCvImageFile(null); setModalOpen(false);
      toast.success('Speaker added!');
    } catch { toast.error('Failed to add speaker'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/speakers/${id}/`);
    setSpeakers((prev) => prev.filter((s) => s.id !== id));
    toast.success('Speaker removed');
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Speakers</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary" disabled={!selectedEvent}>+ Add Speaker</button>
      </div>
      <select className="input max-w-xs mb-6" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
        {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
      </select>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => <div key={n} className="skeleton h-32 rounded-card" />)}
        </div>
      ) : speakers.length === 0 ? <EmptyState title="No speakers yet" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {speakers.map((sp) => (
            <div key={sp.id} className="card flex items-start gap-4">
              {sp.photo
                ? <img src={mediaUrl(sp.photo)} alt={sp.first_name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                : <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">{sp.first_name[0]}</div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{sp.first_name} {sp.last_name}</p>
                <p className="text-sm text-primary">{sp.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {sp.cv_image ? (
                    <a href={mediaUrl(sp.cv_image)} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      View CV Image
                    </a>
                  ) : (
                    'No CV uploaded'
                  )}
                </p>
              </div>
              <button onClick={() => handleDelete(sp.id)} className="text-danger hover:opacity-70 text-sm shrink-0">🗑️</button>
            </div>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setPhotoFile(null); setCvImageFile(null); reset(); }} title="Add Speaker">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">First name</label><input {...register('first_name', { required: true })} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Last name</label><input {...register('last_name', { required: true })} className="input" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1.5">Title / Role</label><input {...register('title', { required: true })} className="input" placeholder="AI Research Lead" /></div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Speaker CV (Image)</label>
            <input type="file" accept="image/*" onChange={(e) => setCvImageFile(e.target.files[0])} className="input" />
          </div>
          <div><label className="block text-sm font-medium mb-1.5">Schedule time</label><input {...register('schedule_time')} type="datetime-local" className="input" /></div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Photo <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="input" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Adding...' : 'Add Speaker'}</button>
        </form>
      </Modal>
    </div>
  );
}

// ── Sponsors Page ────────────────────────────────────────────────────────────
function SponsorsPage() {
  const [events, setEvents] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    api.get('/api/events/').then(({ data }) => {
      const evs = data.results || data; setEvents(evs);
      if (evs.length > 0) setSelectedEvent(evs[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    setLoading(true);
    api.get(`/api/events/${selectedEvent}/sponsors/`).then(({ data }) => setSponsors(data.results || data)).finally(() => setLoading(false));
  }, [selectedEvent]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', data.name);
      if (logoFile) fd.append('logo', logoFile);
      const res = await api.post(`/api/events/${selectedEvent}/sponsors/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSponsors((prev) => [...prev, res.data]); reset(); setLogoFile(null); setModalOpen(false);
      toast.success('Sponsor added!');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sponsors</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary" disabled={!selectedEvent}>+ Add Sponsor</button>
      </div>
      <select className="input max-w-xs mb-6" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
        {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
      </select>
      {loading ? <div className="flex gap-4">{[1, 2, 3].map((n) => <div key={n} className="skeleton h-16 w-32 rounded-card" />)}</div>
        : sponsors.length === 0 ? <EmptyState title="No sponsors yet" />
          : (
            <div className="flex flex-wrap gap-4">
              {sponsors.map((sp) => (
                <div key={sp.id} className="card flex items-center gap-3 py-3 px-5">
                  {sp.logo && <img src={mediaUrl(sp.logo)} alt={sp.name} className="h-8 object-contain" />}
                  <span className="font-bold">{sp.name}</span>
                  <button onClick={async () => { await api.delete(`/api/sponsors/${sp.id}/`); setSponsors((p) => p.filter((s) => s.id !== sp.id)); toast.success('Removed'); }} className="text-danger text-sm">🗑️</button>
                </div>
              ))}
            </div>
          )}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setLogoFile(null); reset(); }} title="Add Sponsor">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
          <div>
            <label className="block text-sm font-medium mb-1.5">Logo <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="input" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Adding...' : 'Add Sponsor'}</button>
        </form>
      </Modal>
    </div>
  );
}

// ── Organizers Page ──────────────────────────────────────────────────────────
function OrganizersPage() {
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [availableOrganizers, setAvailableOrganizers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [doorNumber, setDoorNumber] = useState('');
  const [workSchedule, setWorkSchedule] = useState('');

  useEffect(() => {
    api.get('/api/auth/organizers/').then(({ data }) => setAvailableOrganizers(data.results || data));
    api.get('/api/events/').then(({ data }) => {
      const evs = data.results || data;
      setEvents(evs);
      if (evs.length > 0) setSelectedEvent(evs[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    api.get(`/api/events/${selectedEvent}/organizers/`).then(({ data }) => setOrganizers(data.results || data));
  }, [selectedEvent]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) { toast.error('Please select an organizer'); return; }
    if (!doorNumber) { toast.error('Door number is required'); return; }
    setSaving(true);
    try {
      const res = await api.post(`/api/events/${selectedEvent}/organizers/`, {
        user_id: selectedUserId,
        door_number: doorNumber,
        work_schedule: workSchedule,
      });
      setOrganizers((prev) => [...prev, res.data]);
      setSelectedUserId(''); setDoorNumber(''); setWorkSchedule('');
      setModalOpen(false);
      toast.success('Organizer assigned to event!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to assign organizer');
    } finally { setSaving(false); }
  };

  // Organizers already assigned to the selected event (to exclude from dropdown)
  const assignedUserIds = new Set(organizers.map((o) => o.user?.id));
  const unassigned = availableOrganizers.filter((u) => !assignedUserIds.has(u.id));

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Organizers</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary" disabled={!selectedEvent}>+ Assign Organizer</button>
      </div>
      <select className="input max-w-xs mb-6" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
        {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
      </select>
      {organizers.length === 0 ? <EmptyState title="No organizers assigned" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizers.map((org) => (
            <div key={org.id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">{org.user?.first_name?.[0] || 'O'}</div>
                <div><p className="font-semibold">{org.user?.first_name} {org.user?.last_name}</p><p className="text-xs text-gray-500">{org.user?.email}</p></div>
              </div>
              <div className="flex gap-4 text-sm text-gray-500"><span>🚪 Door: <strong>{org.door_number}</strong></span><span>⏰ {org.work_schedule}</span></div>
            </div>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Assign Organizer">
        {unassigned.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No available organizers to assign.</p>
            <p className="text-gray-400 text-xs mt-1">Ask an organizer to register an account first, then the admin must approve it.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Select Organizer</label>
              <select
                className="input"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
              >
                <option value="">— choose an organizer —</option>
                {unassigned.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.first_name} {u.last_name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Door / Station number</label>
              <input value={doorNumber} onChange={(e) => setDoorNumber(e.target.value)} className="input" placeholder="e.g. A1" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Work schedule</label>
              <input value={workSchedule} onChange={(e) => setWorkSchedule(e.target.value)} className="input" placeholder="09:00-18:00" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Assigning...' : 'Assign Organizer'}</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

// ── Statistics Page ──────────────────────────────────────────────────────────
const PIE_COLORS = ['#6C47FF', '#00D4AA', '#FF5757'];

function KPICard({ label, value, sub, color, icon }) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="stat-card flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>{value ?? '—'}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {sub != null && <p className="text-xs text-primary/60 mt-0.5 font-medium">{sub}</p>}
      </div>
    </motion.div>
  );
}

function StatsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [stats, setStats] = useState(null);
  const [eventStats, setEventStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Load events list + global stats
  useEffect(() => {
    Promise.all([
      api.get('/api/events/'),
      api.get('/api/client/stats/').catch(() => null),
    ]).then(([evRes, stRes]) => {
      const evs = evRes.data.results || evRes.data;
      setEvents(evs);
      if (evs.length > 0) setSelectedEvent(String(evs[0].id));
      if (stRes) setStats(stRes.data);
    }).finally(() => setLoading(false));
  }, []);

  // Load per-event stats whenever selection changes
  useEffect(() => {
    if (!selectedEvent) return;
    setLoadingEvent(true);
    setEventStats(null);
    api.get(`/api/events/${selectedEvent}/stats/`).catch(() => null)
      .then((res) => { if (res) setEventStats(res.data); })
      .finally(() => setLoadingEvent(false));
  }, [selectedEvent]);

  const totalReg = eventStats?.total ?? stats?.registrations_per_event?.reduce((s, e) => s + e.total, 0) ?? 0;
  const present = eventStats?.present ?? stats?.registrations_per_event?.reduce((s, e) => s + e.present, 0) ?? 0;
  const absent = totalReg - present;
  const rate = totalReg > 0 ? Math.round((present / totalReg) * 100) : 0;

  // Build 14-day bar chart data (mock days if API doesn't return daily breakdown)
  const barData = (() => {
    if (eventStats?.daily) return eventStats.daily;
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        day: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        registrations: 0,
      });
    }
    return days;
  })();

  // Donut chart data
  const donutData = [
    { name: 'Present', value: present },
    { name: 'Absent', value: absent },
  ];

  // Participant list
  const participants = eventStats?.participants ?? [];

  const toggleRow = (id) => {
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelectedRows(selectedRows.length === participants.length ? [] : participants.map((p) => p.id));
  };

  const exportCSV = () => {
    if (participants.length === 0) { toast.error('No participants to export'); return; }
    const rows = [['Name', 'Email', 'Present'], ...participants.map((p) => [p.name, p.email, p.is_present ? 'Yes' : 'No'])];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'participants.csv';
    a.click();
    toast.success('CSV exported');
  };

  if (loading) return (
    <div className="flex-1 p-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((n) => <div key={n} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
      <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
    </div>
  );

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Header + Event selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Statistics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track registrations, attendance, and participant data.</p>
        </div>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm min-w-[180px]"
        >
          {events.map((ev) => <option key={ev.id} value={String(ev.id)}>{ev.title}</option>)}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <KPICard
          label="Total Registered"
          value={totalReg}
          color="bg-primary/10"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="2" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        />
        <KPICard
          label="Present"
          value={present}
          color="bg-green-100"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="w-6 h-6"><polyline points="20 6 9 17 4 12" /></svg>}
        />
        <KPICard
          label="Absent"
          value={absent}
          color="bg-red-100"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
        />
        <KPICard
          label="Participation Rate"
          value={`${rate}%`}
          color="bg-accent/10"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" className="w-6 h-6"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Registrations per Day</h3>
          <p className="text-xs text-gray-400 mb-4">Last 14 days</p>
          {loadingEvent ? (
            <div className="h-52 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={barData} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                />
                <Bar dataKey="registrations" fill="#6C47FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-900 mb-1">Attendance Overview</h3>
          <p className="text-xs text-gray-400 mb-4">Present vs Absent</p>
          {loadingEvent ? (
            <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                {donutData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Participants table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Participants</h3>
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Export CSV ({selectedRows.length})
              </button>
              <button className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                Generate Attestations
              </button>
            </div>
          )}
        </div>
        {loadingEvent ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((n) => <div key={n} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : participants.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-sm">No participant data available for this event.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="pl-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === participants.length}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Participant</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="pl-5 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(p.id)}
                      onChange={() => toggleRow(p.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {(p.name || '?')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.is_present ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_present ? 'Present' : 'Registered'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Payments Page ─────────────────────────────────────────────────────────────
const STATUS_BADGE = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

function PaymentsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [tab, setTab] = useState('registrations'); // 'registrations' | 'stands'
  const [registrations, setRegistrations] = useState([]);
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Receipt modal state
  const [receiptUrl, setReceiptUrl] = useState(null);

  useEffect(() => {
    api.get('/api/events/').then(({ data }) => {
      const evs = data.results || data;
      setEvents(evs);
      if (evs.length > 0) setSelectedEvent(evs[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    setLoading(true);
    const regsPromise = api.get(`/api/client/events/${selectedEvent}/registrations/`).then(({ data }) => setRegistrations(data.results || data)).catch(() => setRegistrations([]));
    const standsPromise = api.get(`/api/client/events/${selectedEvent}/exhibitor-stands/`).then(({ data }) => setStands(data.results || data)).catch(() => setStands([]));
    Promise.all([regsPromise, standsPromise]).finally(() => setLoading(false));
  }, [selectedEvent]);

  const approveReg = async (id) => {
    setActionLoading(true);
    try {
      const { data } = await api.patch(`/api/client/registrations/${id}/approve/`);
      setRegistrations((prev) => prev.map((r) => r.id === id ? data : r));
      toast.success('Payment approved');
    } catch { toast.error('Failed'); } finally { setActionLoading(false); }
  };

  const rejectReg = async (id) => {
    setActionLoading(true);
    try {
      const { data } = await api.patch(`/api/client/registrations/${id}/reject/`);
      setRegistrations((prev) => prev.map((r) => r.id === id ? data : r));
      toast.success('Payment rejected');
    } catch { toast.error('Failed'); } finally { setActionLoading(false); }
  };

  const approveStand = async (id) => {
    setActionLoading(true);
    try {
      const { data } = await api.patch(`/api/client/exhibitor-stands/${id}/approve/`);
      setStands((prev) => prev.map((s) => s.id === id ? data : s));
      toast.success('Stand payment approved');
    } catch { toast.error('Failed'); } finally { setActionLoading(false); }
  };

  const rejectStand = async (id) => {
    setActionLoading(true);
    try {
      const { data } = await api.patch(`/api/client/exhibitor-stands/${id}/reject/`);
      setStands((prev) => prev.map((s) => s.id === id ? data : s));
      toast.success('Stand payment rejected');
    } catch { toast.error('Failed'); } finally { setActionLoading(false); }
  };

  const selectedEventObj = events.find((e) => String(e.id) === String(selectedEvent));
  const isPaid = selectedEventObj?.ticket_type === 'paid';

  // Detect if the receipt is an image or a PDF
  const isImage = receiptUrl && /\.(png|jpe?g|gif|webp|bmp)(\?|$)/i.test(receiptUrl);
  const isPdf = receiptUrl && /\.pdf(\?|$)/i.test(receiptUrl);

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      {/* ── RECEIPT MODAL ── */}
      {receiptUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,10,30,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={() => setReceiptUrl(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxWidth: 780, width: '100%', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-800 text-sm">Payment Receipt</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Open in new tab fallback */}
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-violet-600 font-semibold hover:underline px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
                >
                  Open in new tab ↗
                </a>
                <button
                  onClick={() => setReceiptUrl(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="overflow-auto flex-1 bg-gray-50 flex items-center justify-center p-4">
              {isImage ? (
                <img
                  src={receiptUrl}
                  alt="Payment receipt"
                  className="max-w-full max-h-full rounded-xl shadow object-contain"
                  style={{ maxHeight: 'calc(90vh - 100px)' }}
                />
              ) : isPdf ? (
                <iframe
                  src={receiptUrl}
                  title="Payment Receipt"
                  className="w-full rounded-xl border-0"
                  style={{ height: 'calc(90vh - 110px)', minHeight: 400 }}
                />
              ) : (
                /* Unknown type — show a download prompt */
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Preview not available for this file type.</p>
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                  >
                    Download Receipt
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Payments & Registrations</h1>
      </div>

      <select className="input max-w-xs mb-6" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
        {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
      </select>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['registrations', 'stands'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/40'}`}>
            {t === 'registrations' ? 'Registrations' : 'Exhibitor Stands'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : tab === 'registrations' ? (
        registrations.length === 0 ? <EmptyState title="No registrations yet" /> : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Participant</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                  {isPaid && <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Receipt</th>}
                  {isPaid && <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {registrations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-sm">{r.participant?.first_name} {r.participant?.last_name}</p>
                      <p className="text-xs text-gray-400">{r.participant?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.registered_at ? new Date(r.registered_at).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[r.payment_status] || ''}`}>{r.payment_status}</span>
                    </td>
                    {isPaid && (
                      <td className="px-4 py-3">
                        {r.payment_receipt ? (
                          <button
                            onClick={() => setReceiptUrl(mediaUrl(r.payment_receipt))}
                            className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:underline"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                            </svg>
                            View Receipt
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">No receipt</span>
                        )}
                      </td>
                    )}
                    {isPaid && (
                      <td className="px-4 py-3">
                        {r.payment_status === 'pending' && (
                          <div className="flex gap-2">
                            <button disabled={actionLoading} onClick={() => approveReg(r.id)} className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors">Approve</button>
                            <button disabled={actionLoading} onClick={() => rejectReg(r.id)} className="text-xs font-semibold bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        stands.length === 0 ? <EmptyState title="No exhibitor stand applications yet" /> : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Exhibitor</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stand</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Receipt</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stands.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-sm">{s.exhibitor?.first_name} {s.exhibitor?.last_name}</p>
                      <p className="text-xs text-gray-400">{s.exhibitor?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{s.company_name}</td>
                    <td className="px-4 py-3 text-sm capitalize">{s.stand_type}</td>
                    <td className="px-4 py-3 text-sm">DZD {s.price?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[s.payment_status] || ''}`}>{s.payment_status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {s.payment_receipt ? (
                        <button
                          onClick={() => setReceiptUrl(mediaUrl(s.payment_receipt))}
                          className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:underline"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                          </svg>
                          View Receipt
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.payment_status === 'pending' && (
                        <div className="flex gap-2">
                          <button disabled={actionLoading} onClick={() => approveStand(s.id)} className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors">Approve</button>
                          <button disabled={actionLoading} onClick={() => rejectStand(s.id)} className="text-xs font-semibold bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

// ── Layout ───────────────────────────────────────────────────────────────────
export default function ClientDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClientSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        <Routes>
          <Route index element={<MyEvents />} />
          <Route path="plans" element={<PlanSelection />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="payment-status" element={<PaymentStatus />} />
          <Route path="create" element={<RequirePayment><CreateEvent /></RequirePayment>} />
          <Route path="speakers" element={<SpeakersPage />} />
          <Route path="sponsors" element={<SponsorsPage />} />
          <Route path="organizers" element={<OrganizersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="stats" element={<StatsPage />} />
        </Routes>
      </div>
    </div>
  );
}
