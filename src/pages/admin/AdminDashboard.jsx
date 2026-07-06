import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import { formatDate } from '../../utils/formatters';
import useAuthStore from '../../store/authStore';
import { getInitials } from '../../utils/formatters';

// ── Shared Icons ─────────────────────────────────────────────────────────────
const Ico = {
  Grid: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ChevLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ChevUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Map: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Mic: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  UserPlus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" /><line x1="16" y1="11" x2="22" y2="11" />
    </svg>
  ),
  MoreVert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  ),
  Reports: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  CreditCard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
};

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    approved: 'bg-green-100 text-green-700 border border-green-200',
    pending:  'bg-orange-100 text-orange-600 border border-orange-200',
    rejected: 'bg-red-100 text-danger border border-red-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ── Role badge for users ─────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const map = {
    admin:       'bg-purple-100 text-purple-700',
    organizer:   'bg-blue-100 text-blue-700',
    client:      'bg-yellow-100 text-yellow-700',
    participant: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${map[role] || 'bg-gray-100 text-gray-600'}`}>
      {role}
    </span>
  );
}

// ── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

// ── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, total, perPage, onChange }) {
  const lastPage = Math.ceil(total / perPage);
  if (lastPage <= 1) return null;
  const pages = [];
  if (lastPage <= 5) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, '…', lastPage);
  }
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
      <span className="text-sm text-gray-500">
        Showing <strong>{Math.min((page - 1) * perPage + 1, total)}</strong> to{' '}
        <strong>{Math.min(page * perPage, total)}</strong> of <strong>{total}</strong>
      </span>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(Math.max(page - 1, 1))} disabled={page === 1}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
          <Ico.ChevLeft />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={i} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
          ) : (
            <button key={p} onClick={() => onChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === p ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>{p}</button>
          )
        )}
        <button onClick={() => onChange(Math.min(page + 1, lastPage))} disabled={page === lastPage}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
          <Ico.ChevRight />
        </button>
      </div>
    </div>
  );
}

// ── Admin Sidebar ─────────────────────────────────────────────────────────────
function AdminSidebar({ variant = 'admin' }) {
  const { user, logout } = useAuthStore();
  const links = variant === 'users'
    ? [
        { to: '/admin', end: true, icon: <Ico.Grid />, label: 'Dashboard' },
        { to: '/admin/events', icon: <Ico.Calendar />, label: 'Events' },
        { to: '/admin/users', icon: <Ico.Users />, label: 'Users' },
      ]
    : [
        { to: '/admin', end: true, icon: <Ico.Grid />, label: 'Overview' },
        { to: '/admin/events', icon: <Ico.Calendar />, label: 'Events' },
        { to: '/admin/registrations', icon: <Ico.Reports />, label: 'Registrations' },
        { to: '/admin/payments', icon: <Ico.CreditCard />, label: 'Client Payments' },
        { to: '/admin/users', icon: <Ico.Users />, label: 'Users' },
      ];

  return (
    <aside className="w-64 min-h-screen sidebar-glass border-r border-white/50 flex flex-col shrink-0 relative z-20">
      <div className="p-5 border-b border-gray-100">
        {variant === 'users' ? (
          <>
            <p className="text-primary font-extrabold text-base tracking-wide uppercase">Eventora</p>
            <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Management Portal</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span className="font-bold text-lg">Eventora</span>
            </div>
            <p className="text-xs text-gray-400 font-medium ml-11">Admin Console</p>
          </>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary shadow-[inset_4px_0_0_0_#6C47FF]' : 'text-gray-500 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm'
              }`
            }>
            {link.icon}{link.label}
          </NavLink>
        ))}
      </nav>
      {variant === 'users' ? (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user)}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            </div>
            <button onClick={logout} title="Logout" className="text-gray-400 hover:text-danger transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                {getInitials(user)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} title="Logout" className="text-gray-400 hover:text-danger transition-colors ml-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

// ── Event Detail Modal ────────────────────────────────────────────────────────
function EventDetailModal({ event, open, onClose, onApprove, onReject, actionLoading }) {
  const scrollRef = useRef(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!open) { setUnlocked(false); }
  }, [open]);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    if (near) setUnlocked(true);
  };

  if (!event) return null;

  const capacity = event.max_capacity > 0
    ? Math.round((event.registrations_count || 0) / event.max_capacity * 100)
    : 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-[28px] shadow-[0_24px_64px_rgba(108,71,255,0.16)] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Ico.Info />
            </div>
            <h2 className="font-bold text-gray-900">Event Submission Review</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <Ico.X />
          </button>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
        >
          <div className="flex gap-0">
            {/* Left column */}
            <div className="flex-1 p-6 border-r border-gray-100">
              {/* Event identity */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {event.logo ? (
                    <img src={event.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="1.5" className="w-9 h-9">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full uppercase">Technology</span>
                    <span className="text-xs text-gray-400">ID: EVT-{String(event.id).padStart(4, '0')}</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">{event.title}</h1>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{event.description}</p>
                </div>
              </div>

              {/* Info chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {formatDate(event.date)}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  09:00 AM PST
                </span>
                <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  {event.location}
                </span>
              </div>

              {/* Map placeholder */}
              <div className="h-40 bg-gray-100 rounded-2xl mb-5 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 160">
                  {[0,30,60,90,120,150,180,210,240,270,300].map(x => (
                    <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#6C47FF" strokeWidth="0.5" />
                  ))}
                  {[0,30,60,90,120,150,160].map(y => (
                    <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#6C47FF" strokeWidth="0.5" />
                  ))}
                </svg>
                <div className="relative bg-white rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2.5 z-10">
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                    <Ico.Map />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Venue</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Capacity</p>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-2xl font-extrabold text-gray-900">
                    {event.max_capacity?.toLocaleString()} <span className="text-base font-medium text-gray-500">Tickets Available</span>
                  </p>
                  <span className="text-primary text-sm font-semibold">
                    Early Bird: {(event.registrations_count || 0).toLocaleString()} Sold
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(capacity, 100)}%` }} />
                </div>
              </div>

              {/* Organizer details */}
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Organizer Details</p>
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {event.client?.first_name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {event.client?.first_name} {event.client?.last_name || event.client?.username}
                    </p>
                    <p className="text-xs text-gray-400">{event.client?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="w-64 shrink-0 p-6 space-y-6">
              {/* Selected theme */}
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Selected Theme</p>
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  {/* Browser mockup */}
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="1.5" className="w-6 h-6 opacity-40">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-1.5 bg-gray-200 rounded-full w-1/2" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-primary/20 rounded w-16" />
                      <div className="h-6 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                  <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 capitalize">{event.theme || 'Modern'} Theme</span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Event assets */}
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Event Assets</p>
                <div className="space-y-2">
                  {[
                    { label: 'Speakers', count: event.speakers_count || event.speakers?.length || 0, color: 'text-blue-500', bg: 'bg-blue-50',
                      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>
                    },
                    { label: 'Sponsors', count: event.sponsors_count || event.sponsors?.length || 0, color: 'text-orange-500', bg: 'bg-orange-50',
                      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                    },
                    { label: 'Organizers', count: event.organizers_count || event.organizers?.length || 0, color: 'text-green-500', bg: 'bg-green-50',
                      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>
                    },
                  ].map((asset) => (
                    <div key={asset.label} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${asset.bg} ${asset.color} flex items-center justify-center`}>{asset.icon}</div>
                        <span className="text-sm font-medium text-gray-700">{asset.label}</span>
                      </div>
                      <span className={`text-sm font-bold ${asset.color}`}>{asset.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Padding to allow scroll unlock */}
              <div className="h-12" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white/40 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Ico.Lock />
            {unlocked
              ? <span className="text-green-600 font-medium">Approval actions unlocked</span>
              : 'Please scroll to the bottom to unlock approval actions'
            }
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onReject(event.id); onClose(); }}
              disabled={!unlocked || actionLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <Ico.X /> Reject
            </button>
            <button
              onClick={() => { onApprove(event.id); onClose(); }}
              disabled={!unlocked || actionLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 disabled:opacity-50 enabled:bg-primary enabled:text-white hover:enabled:bg-primary-dark transition-all"
            >
              <Ico.Check /> Approve
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Admin Events Page ─────────────────────────────────────────────────────────
const STATUS_TABS = ['All', 'Pending', 'Approved', 'Rejected'];

function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const PER_PAGE = 10;

  const fetchEvents = () => {
    setLoading(true);
    const params = new URLSearchParams({ page });
    if (tab !== 'All') params.set('status', tab.toLowerCase());
    if (search) params.set('search', search);
    api.get(`/api/events/?${params}`)
      .then(({ data }) => {
        const list = data.results || data;
        setEvents(list);
        setFiltered(list);
        setTotal(data.count || list.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchEvents(); }, [tab, page]);

  useEffect(() => {
    if (!search) { setFiltered(events); return; }
    setFiltered(events.filter(e =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase()) ||
      e.client?.username?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, events]);

  const counts = {
    All: total,
    Pending: events.filter(e => e.status === 'pending').length,
    Approved: events.filter(e => e.status === 'approved').length,
    Rejected: events.filter(e => e.status === 'rejected').length,
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const { data } = await api.patch(`/api/events/${id}/approve/`);
      setEvents(prev => prev.map(e => e.id === id ? data : e));
      toast.success('Event approved!');
    } catch { toast.error('Failed to approve'); }
    finally { setActionLoading(false); }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      const { data } = await api.patch(`/api/events/${id}/reject/`);
      setEvents(prev => prev.map(e => e.id === id ? data : e));
      toast.success('Event rejected');
    } catch { toast.error('Failed to reject'); }
    finally { setActionLoading(false); }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>Events</h1>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Ico.Search /></span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events..."
            className="bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-6">
        {STATUS_TABS.map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${tab === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
              {counts[t] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-glass p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['EVENT', 'CLIENT', 'DATE', 'LOCATION', 'CAPACITY', 'STATUS', 'ACTIONS'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 tracking-wider">
                  <span className="flex items-center gap-1">{h}
                    {['EVENT','DATE'].includes(h) && <Ico.ChevUp />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="skeleton h-4 rounded w-20" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">No events found</td></tr>
            ) : (
              filtered.map(ev => {
                const cap = ev.max_capacity > 0 ? Math.round((ev.registrations_count || 0) / ev.max_capacity * 100) : 0;
                return (
                  <tr key={ev.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                          {ev.logo
                            ? <img src={ev.logo} alt="" className="w-full h-full object-cover" />
                            : <svg viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="1.5" className="w-5 h-5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              </svg>
                          }
                        </div>
                        <span className="font-semibold text-gray-900 text-sm leading-snug max-w-[140px]">{ev.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-sm">
                      {ev.client?.first_name || ev.client?.username || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">{formatDate(ev.date)}</td>
                    <td className="px-5 py-4 text-gray-500 text-sm">{ev.location}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{ev.registrations_count || 0} / {ev.max_capacity}</span>
                            <span>{cap}%</span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(cap, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={ev.status} /></td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => { setSelectedEvent(ev); setDetailOpen(true); }}
                        className="text-primary text-sm font-semibold hover:underline whitespace-nowrap"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <Pagination page={page} total={total} perPage={PER_PAGE} onChange={setPage} />
      </div>

      <AnimatePresence>
        {detailOpen && (
          <EventDetailModal
            event={selectedEvent}
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            onApprove={handleApprove}
            onReject={handleReject}
            actionLoading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Admin Users Page ──────────────────────────────────────────────────────────
function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | pending | active
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const PER_PAGE = 10;

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams({ page });
    if (search) params.set('search', search);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    api.get(`/api/admin/users/?${params}`)
      .then(({ data }) => {
        setUsers(data.results || data);
        setTotal(data.count || (data.results || data).length);
      })
      .catch(() => {
        api.get('/api/users/')
          .then(({ data }) => {
            setUsers(data.results || data);
            setTotal(data.count || (data.results || data).length);
          })
          .catch(() => {});
      })
      .finally(() => setLoading(false));
  };

  const fetchPendingCount = () => {
    api.get('/api/admin/users/pending/')
      .then(({ data }) => {
        const list = data.results || data;
        setPendingCount(data.count || list.length || 0);
      })
      .catch(() => {});
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchUsers(); fetchPendingCount(); }, [page, statusFilter]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchUsers(); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleActive = async (user) => {
    try {
      await api.patch(`/api/admin/users/${user.id}/`, { is_active: !user.is_active });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
      fetchPendingCount();
    } catch { toast.error('Failed to update user'); }
  };

  const approveUser = async (user) => {
    try {
      await api.post(`/api/admin/users/${user.id}/approve/`);
      toast.success(`${user.first_name || user.email} approved`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: true } : u));
      fetchPendingCount();
    } catch { toast.error('Failed to approve user'); }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete user ${user.email}? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/admin/users/${user.id}/`);
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u.id !== user.id));
      fetchPendingCount();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  const changeRole = async (user, newRole) => {
    try {
      await api.patch(`/api/admin/users/${user.id}/`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      toast.success('Role updated');
    } catch { toast.error('Failed to change role'); }
  };

  const formatRegistration = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const TABS = [
    { key: 'all', label: 'All Users' },
    { key: 'pending', label: `Pending Approval${pendingCount ? ` (${pendingCount})` : ''}` },
    { key: 'active', label: 'Active' },
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>Users</h1>
          <span className="text-primary font-semibold text-base">{total.toLocaleString()} total</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Ico.Search /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or role..."
              className="bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setPage(1); setStatusFilter(t.key); }}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              statusFilter === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-glass p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['AVATAR', 'FULL NAME', 'ROLE', 'EMAIL', 'REGISTRATION', 'STATUS', 'ACTIONS'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 tracking-wider">
                  <span className="flex items-center gap-1">{h}
                    {h === 'FULL NAME' || h === 'REGISTRATION' ? <Ico.ChevUp /> : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => <td key={j} className="px-5 py-4"><div className="skeleton h-4 rounded w-20" /></td>)}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">No users found</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold overflow-hidden">
                      {u.avatar
                        ? <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                        : getInitials(u)
                      }
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900 text-sm">{u.first_name} {u.last_name}</td>
                  <td className="px-5 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u, e.target.value)}
                      className="bg-transparent border border-gray-200 rounded-lg text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="admin">Admin</option>
                      <option value="client">Client</option>
                      <option value="organizer">Organizer</option>
                      <option value="participant">Participant</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-sm">{u.email}</td>
                  <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">{formatRegistration(u.date_joined)}</td>
                  <td className="px-5 py-4">
                    <Toggle checked={u.is_active} onChange={() => toggleActive(u)} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {!u.is_active && (
                        <button
                          onClick={() => approveUser(u)}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(u)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} total={total} perPage={PER_PAGE} onChange={setPage} />
      </div>
    </div>
  );
}

// ── Admin Home (Overview) ─────────────────────────────────────────────────────
function AdminStatCard({ label, value, icon, iconBg, change, positive }) {
  return (
    <div className="card-glass p-6 flex items-start justify-between hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
        <div>
          <p className="text-gray-500 text-sm mb-1">{label}</p>
          <p className="text-3xl font-extrabold text-gray-900">{value?.toLocaleString() ?? '—'}</p>
        </div>
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-danger'}`}>{change}</span>
    </div>
  );
}

const RECENT_ACTIVITY = [
  { dot: 'bg-primary', title: 'New Event Created', desc: 'Summer Gala 2024 by TechCorp Inc.', time: '2 mins ago' },
  { dot: 'bg-green-500', title: 'User Approved', desc: "Sarah Jenkins's vendor account verified.", time: '45 mins ago' },
  { dot: 'bg-blue-500', title: 'Profile Updated', desc: 'Marketing HQ updated their brand assets.', time: '3 hours ago' },
  { dot: 'bg-gray-300', title: 'System Backup', desc: 'Weekly database optimization completed.', time: '6 hours ago' },
];

function AdminHome() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/api/admin/dashboard/'), api.get('/api/events/')])
      .then(([s, e]) => { setStats(s.data); setEvents(e.data.results || e.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const pendingEvents = events.filter(e => e.status === 'pending');

  const handleApprove = async (id) => {
    setActionLoading(true);
    try { const { data } = await api.patch(`/api/events/${id}/approve/`); setEvents(p => p.map(e => e.id === id ? data : e)); toast.success('Approved!'); }
    catch { toast.error('Failed'); } finally { setActionLoading(false); }
  };
  const handleReject = async (id) => {
    setActionLoading(true);
    try { const { data } = await api.patch(`/api/events/${id}/reject/`); setEvents(p => p.map(e => e.id === id ? data : e)); toast.success('Rejected'); }
    catch { toast.error('Failed'); } finally { setActionLoading(false); }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>Overview</h1>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{[1,2,3,4].map(n => <div key={n} className="skeleton h-28 rounded-2xl" />)}</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <AdminStatCard label="Total Events" value={stats?.total_events} iconBg="bg-primary/10" change="+12%" positive icon={<svg viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="2" className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} />
            <AdminStatCard label="Pending Review" value={stats?.pending_events} iconBg="bg-orange-50" change="+5%" positive icon={<svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" className="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>} />
            <AdminStatCard label="Approved This Month" value={stats?.approved_events} iconBg="bg-blue-50" change="-2%" positive={false} icon={<svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>} />
            <AdminStatCard label="Total Users" value={stats?.total_users} iconBg="bg-purple-50" change="+18%" positive icon={<svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>} />
          </div>
        )}
        <div className="flex gap-6">
          <div className="flex-1 card-glass p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/50 bg-white/40">
              <h2 className="font-bold text-gray-900">Pending Events</h2>
              <NavLink to="/admin/events" className="text-sm font-semibold text-primary hover:underline">View All</NavLink>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">{[1,2,3].map(n => <div key={n} className="skeleton h-10 rounded" />)}</div>
            ) : pendingEvents.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No pending events</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['EVENT TITLE','CLIENT','DATE','ACTIONS'].map(h => <th key={h} className="text-left px-6 py-3 text-xs font-bold text-gray-400 tracking-wider">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingEvents.map(ev => (
                    <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{ev.title}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{ev.client?.first_name || ev.client?.username}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(ev.date)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(ev.id)} disabled={actionLoading} className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 disabled:opacity-50"><Ico.Check /></button>
                          <button onClick={() => handleReject(ev.id)} disabled={actionLoading} className="w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center hover:opacity-80 disabled:opacity-50"><Ico.X /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="w-72 shrink-0 card-glass p-6">
            <h2 className="font-bold text-gray-900 mb-5">Recent Activity</h2>
            <div className="space-y-5">
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${item.dot}`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    <p className="text-xs text-gray-400 mt-1.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Admin Registrations Page ──────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('All');
  const [actionLoading, setActionLoading] = useState(false);
  const PAYMENT_TABS = ['All', 'Pending', 'Approved', 'Rejected'];

  const fetchRegistrations = () => {
    setLoading(true);
    const params = tab !== 'All' ? `?payment_status=${tab.toLowerCase()}` : '';
    api.get(`/api/admin/registrations/${params}`)
      .then(({ data }) => setRegistrations(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchRegistrations(); }, [tab]);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const { data } = await api.patch(`/api/admin/registrations/${id}/approve/`);
      setRegistrations(prev => prev.map(r => r.id === id ? data : r));
      toast.success('Payment approved!');
    } catch { toast.error('Failed'); }
    finally { setActionLoading(false); }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      const { data } = await api.patch(`/api/admin/registrations/${id}/reject/`);
      setRegistrations(prev => prev.map(r => r.id === id ? data : r));
      toast.success('Payment rejected');
    } catch { toast.error('Failed'); }
    finally { setActionLoading(false); }
  };

  const paymentBadge = (status) => {
    const map = {
      pending: 'bg-orange-100 text-orange-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${map[status] || 'bg-gray-100 text-gray-500'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>Registrations</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {PAYMENT_TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card-glass p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['PARTICIPANT', 'EVENT', 'DATE', 'PAYMENT', 'RECEIPT', 'ACTIONS'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="skeleton h-4 rounded w-20" /></td>
                  ))}
                </tr>
              ))
            ) : registrations.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">No registrations found</td></tr>
            ) : (
              registrations.map(reg => (
                <tr key={reg.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {(reg.participant?.first_name || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{reg.participant?.first_name} {reg.participant?.last_name}</p>
                        <p className="text-xs text-gray-400">{reg.participant?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-700">{reg.event?.title}</td>
                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(reg.registered_at)}</td>
                  <td className="px-5 py-4">{paymentBadge(reg.payment_status)}</td>
                  <td className="px-5 py-4">
                    {reg.payment_receipt ? (
                      <a
                        href={`${API_BASE}${reg.payment_receipt}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-semibold hover:underline"
                      >
                        View Receipt
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {reg.payment_status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(reg.id)}
                          disabled={actionLoading}
                          className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 disabled:opacity-50"
                        >
                          <Ico.Check />
                        </button>
                        <button
                          onClick={() => handleReject(reg.id)}
                          disabled={actionLoading}
                          className="w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center hover:opacity-80 disabled:opacity-50"
                        >
                          <Ico.X />
                        </button>
                      </div>
                    )}
                    {reg.payment_status !== 'pending' && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Admin Client Payments Page ────────────────────────────────────────────────
function AdminClientPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/api/admin/payments/');
      const raw = res.data;
      setPayments(Array.isArray(raw) ? raw : Array.isArray(raw?.results) ? raw.results : []);
    } catch (err) {
      toast.error('Failed to load client payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/admin/payments/${id}/approve/`);
      setPayments(prev => prev.map(p => p.id === id ? res.data : p));
      toast.success('Payment approved');
    } catch (err) { toast.error('Approval failed'); }
    finally { setActionLoading(false); }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/admin/payments/${id}/reject/`);
      setPayments(prev => prev.map(p => p.id === id ? res.data : p));
      toast.success('Payment rejected');
    } catch (err) { toast.error('Rejection failed'); }
    finally { setActionLoading(false); }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Client Payments</h1>
      
      <div className="card-glass p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['CLIENT', 'PLAN', 'PRICE', 'STATUS', 'RECEIPT', 'ACTIONS'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
               <tr><td colSpan={6} className="p-8 text-center text-gray-400">Loading...</td></tr>
            ) : payments.length === 0 ? (
               <tr><td colSpan={6} className="p-8 text-center text-gray-400">No payments found</td></tr>
            ) : (
              payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {p.client.username[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">{p.client.username}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium">{p.plan_details.name}</td>
                  <td className="px-5 py-4 font-bold">{p.plan_details.price} DZD</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={p.status} />
                    {p.is_used && <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Used</span>}
                  </td>
                  <td className="px-5 py-4">
                    {p.receipt_image ? (
                      <a
                        href={p.receipt_image.startsWith('http') ? p.receipt_image : `${API_BASE}${p.receipt_image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Receipt
                      </a>
                    ) : <span className="text-gray-400 text-sm">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    {p.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(p.id)} disabled={actionLoading} className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 disabled:opacity-50">
                          <Ico.Check />
                        </button>
                        <button onClick={() => handleReject(p.id)} disabled={actionLoading} className="w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center hover:bg-red-600 disabled:opacity-50">
                          <Ico.X />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#f8f7ff] font-sans relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-purple w-[600px] h-[600px] top-[-200px] left-[-200px] opacity-30" />
      <div className="orb orb-teal w-[500px] h-[500px] bottom-[-200px] right-[-200px] opacity-20" />

      <Routes>
        <Route path="users" element={
          <><AdminSidebar variant="users" /><AdminUsersPage /></>
        } />
        <Route path="*" element={
          <>
            <AdminSidebar variant="admin" />
            <Routes>
              <Route index element={<AdminHome />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="registrations" element={<AdminRegistrationsPage />} />
              <Route path="payments" element={<AdminClientPaymentsPage />} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  );
}
