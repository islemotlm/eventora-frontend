import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { getInitials } from '../utils/formatters';

export default function Sidebar({ links, title }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 min-h-screen sidebar-glass flex flex-col shrink-0"
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[rgba(124,58,237,0.08)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_12px_rgba(124,58,237,0.35)]">
            E
          </div>
          <span className="font-extrabold text-xl text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
            Eventora
          </span>
        </div>
        {title && (
          <p className="text-[10px] text-primary/70 mt-2 font-bold uppercase tracking-[0.18em]">{title}</p>
        )}
      </div>

      {/* User pill */}
      <div className="px-4 py-3 mx-3 mt-4 rounded-2xl bg-gradient-to-r from-primary/[0.06] to-violet-500/[0.04] border border-primary/[0.1]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_8px_rgba(124,58,237,0.3)]">
            {getInitials(user)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-primary/70 capitalize font-medium">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((link) => (
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
          onClick={handleLogout}
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
    </motion.aside>
  );
}
