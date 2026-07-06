import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { getInitials } from '../utils/formatters';

const SUGGESTIONS = [
  {
    label: 'Tech Summits',
    bg: 'from-blue-900 via-indigo-900 to-gray-900',
    path: '/events?category=tech',
  },
  {
    label: 'Music Festivals',
    bg: 'from-orange-700 via-amber-600 to-orange-900',
    path: '/events?category=music',
  },
  {
    label: 'Corporate Galas',
    bg: 'from-gray-800 via-gray-700 to-gray-900',
    path: '/events?category=corporate',
  },
];

export default function NotFound() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(145deg, #F0EDFF 0%, #E8F8F4 100%)' }}>
      {/* Navbar */}
      <nav className="bg-white/70 backdrop-blur-sm border-b border-gray-100/80 px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg,#7C3AED,#00D4AA)' }} />
          <span className="font-bold text-gray-900 text-base">Eventora</span>
        </Link>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          {user ? (
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user)}
            </div>
          ) : (
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Sign in</Link>
          )}
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-16 left-1/4"
          >
            <div className="w-10 h-10 border-2 border-violet-300/50 rounded-lg" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-24 right-1/4"
          >
            <div className="w-5 h-5 bg-violet-400/40 rounded-sm" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-1/3 right-1/3"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-300/30" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 left-1/3"
          >
            <div className="w-9 h-9 rounded-full border-2 border-gray-300/50" />
          </motion.div>
        </div>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[120px] sm:text-[160px] font-black leading-none select-none mb-4"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </motion.div>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3"
        >
          Oops — this page doesn't exist.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-gray-400 text-center max-w-sm mb-9"
        >
          The page you are looking for might have been moved, renamed, or is temporarily unavailable.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-3 justify-center mb-16"
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-2xl transition-opacity hover:opacity-90 shadow-sm"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to home
          </Link>
          <Link
            to="/events"
            className="flex items-center gap-2 text-gray-700 font-semibold px-6 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            Browse events
          </Link>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="w-full max-w-3xl"
        >
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Maybe you were looking for...
          </p>
          <div className="grid grid-cols-3 gap-4">
            {SUGGESTIONS.map((s) => (
              <Link
                key={s.label}
                to={s.path}
                className={`relative h-36 rounded-2xl overflow-hidden bg-gradient-to-br ${s.bg} flex items-end hover:scale-[1.02] transition-transform shadow-sm`}
              >
                <div className="absolute inset-0 bg-black/25" />
                <span className="relative z-10 text-white font-bold text-sm px-4 py-3">{s.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-5 text-sm text-gray-400 mb-3">
          <a href="/" className="hover:text-gray-700 transition-colors">Support</a>
          <a href="/" className="hover:text-gray-700 transition-colors">Privacy</a>
          <a href="/" className="hover:text-gray-700 transition-colors">Status</a>
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Eventora Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
