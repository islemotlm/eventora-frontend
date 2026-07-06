import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import EventCard from '../../components/EventCard';
import SkeletonCard from '../../components/SkeletonCard';
import api from '../../utils/axios';

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All Events', icon: '✦' },
  { key: 'free', label: 'Free', icon: '🎁' },
  { key: 'paid', label: 'Paid', icon: '🎟' },
];

/* Floating particle */
const Particle = ({ style }) => (
  <motion.div
    animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.35)',
      ...style,
    }}
  />
);

const particles = [
  { top: '15%', left: '8%' }, { top: '40%', left: '4%' }, { top: '70%', left: '10%' },
  { top: '20%', left: '88%' }, { top: '55%', left: '93%' }, { top: '80%', left: '85%' },
  { top: '10%', left: '55%' }, { top: '85%', left: '45%' }, { top: '30%', left: '72%' },
];

const rings = [
  { size: 500, opacity: 0.04, delay: 0 },
  { size: 340, opacity: 0.06, delay: 0.8 },
  { size: 200, opacity: 0.09, delay: 1.6 },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 1, 0.5, 1] } }),
  exit: { opacity: 0, y: -10, scale: 0.96, transition: { duration: 0.2 } },
};

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    api.get('/api/events/')
      .then(({ data }) => setEvents(data.results || data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (e.title || '').toLowerCase().includes(q) ||
      (e.location || '').toLowerCase().includes(q);
    const matchesCategory =
      category === 'all' ||
      (category === 'free' && e.ticket_type !== 'paid') ||
      (category === 'paid' && e.ticket_type === 'paid');
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7ff', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

        .search-input {
          width: 100%;
          padding: 13px 16px 13px 46px;
          border-radius: 14px;
          border: 1.5px solid ${focused ? '#7c3aed' : '#e9e4ff'};
          background: #fff;
          color: #1a1035;
          font-size: 14.5px;
          font-family: 'Outfit', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: ${focused ? '0 0 0 4px rgba(124,58,237,0.1)' : '0 2px 12px rgba(124,58,237,0.06)'};
        }
        .search-input::placeholder { color: #b8aed4; }

        .filter-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 50px;
          border: 1.5px solid #e9e4ff;
          background: #fff;
          color: #9d8ec4;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
        }
        .filter-pill:hover { border-color: #7c3aed; color: #7c3aed; }
        .filter-pill.active {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 16px rgba(124,58,237,0.35);
        }
      `}</style>

      <Navbar />

      {/* ── HERO BANNER ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #3b0764 0%, #6d28d9 50%, #7c3aed 100%)',
          paddingBottom: '48px',
        }}
      >
        {/* Blobs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(167,139,250,0.2)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(109,40,217,0.3)', filter: 'blur(60px)' }} />

        {/* Pulsing rings */}
        {rings.map((r, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.07, 1], opacity: [r.opacity, r.opacity * 2, r.opacity] }}
            transition={{ duration: 5, repeat: Infinity, delay: r.delay, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: r.size, height: r.size,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          />
        ))}

        {/* Floating particles */}
        {particles.map((p, i) => <Particle key={i} style={p} />)}

        {/* Hero text */}
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '72px 24px 32px', position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 50,
                padding: '6px 18px',
                fontSize: 12,
                fontWeight: 600,
                color: '#ddd6fe',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 20,
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
              Live Events Platform
            </motion.div>

            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              Discover{' '}
              <span style={{ color: '#ddd6fe', fontStyle: 'italic' }}>Amazing</span>
              <br />Events Near You
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto 32px' }}
            >
              Browse, explore, and register for the latest events happening around you.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', justifyContent: 'center', gap: 40 }}
            >
              {[['500+', 'Events'], ['12k+', 'Attendees'], ['98%', 'Satisfaction']].map(([val, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{val}</div>
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
            <path d="M0 48 C360 0 1080 0 1440 48 L1440 48 L0 48 Z" fill="#f8f7ff" />
          </svg>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '40px 24px' }}>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: 36, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 300px', minWidth: 240 }}>
            <svg
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#b8aed4', pointerEvents: 'none' }}
              viewBox="0 0 20 20" fill="currentColor"
            >
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search events by title or location…"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORY_FILTERS.map((f) => (
              <motion.button
                key={f.key}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCategory(f.key)}
                className={`filter-pill${category === f.key ? ' active' : ''}`}
              >
                <span>{f.icon}</span>
                {f.label}
              </motion.button>
            ))}
          </div>

          {/* Result count badge */}
          {!loading && (
            <motion.div
              key={filtered.length}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                marginLeft: 'auto',
                padding: '6px 14px',
                borderRadius: 50,
                background: '#ede9fe',
                color: '#7c3aed',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {filtered.length} event{filtered.length !== 1 ? 's' : ''}
            </motion.div>
          )}
        </motion.div>

        {/* Section label */}
        {!loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}
          >
            <div style={{ width: 28, height: 3, borderRadius: 99, background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} />
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7c3aed', fontWeight: 700 }}>
              {category === 'all' ? 'All Events' : category === 'free' ? 'Free Events' : 'Paid Events'}
            </span>
          </motion.div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '80px 24px' }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <svg style={{ width: 40, height: 40, color: '#a78bfa' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </motion.div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#1a1035', marginBottom: 8 }}>
              No events found
            </h3>
            <p style={{ color: '#9d8ec4', maxWidth: 320, margin: '0 auto', lineHeight: 1.65 }}>
              We couldn't find any events matching your criteria. Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(124,58,237,0.07)' }}
                >
                  <EventCard event={ev} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
