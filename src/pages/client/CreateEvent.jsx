import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const STEPS = [
  { number: 1, label: 'Step 1: Info' },
  { number: 2, label: 'Step 2: Tickets' },
  { number: 3, label: 'Step 3: Review' },
];

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-primary">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}
function IconMap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-gray-400">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// ── Live Map Preview using Leaflet + OpenStreetMap ──────────────────────────
function MapPreview({ location }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Load Leaflet CSS once
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  // Init map once
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const init = async () => {
      const L = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js').catch(() => null);
      if (!L || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false,
      }).setView([28.0339, 1.6596], 5); // Default: Algeria center

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    init();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Geocode location and update map when location changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const trimmed = location?.trim();
    if (!trimmed) {
      setNotFound(false);
      // Remove marker if location cleared
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      mapInstanceRef.current.setView([28.0339, 1.6596], 5);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        setNotFound(false);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&limit=1`,
          { signal: controller.signal, headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();

        if (!data.length) {
          setNotFound(true);
          return;
        }

        const { lat, lon, display_name } = data[0];
        const latlng = [parseFloat(lat), parseFloat(lon)];

        const L = (await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js').catch(() => null));
        if (!L || !mapInstanceRef.current) return;

        // Remove old marker
        if (markerRef.current) {
          markerRef.current.remove();
          markerRef.current = null;
        }

        // Custom pin icon
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:28px;height:36px;
            background:var(--color-primary,#7c3aed);
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
          "></div>`,
          iconSize: [28, 36],
          iconAnchor: [14, 36],
          popupAnchor: [0, -38],
        });

        const marker = L.marker(latlng, { icon }).addTo(mapInstanceRef.current);
        marker.bindPopup(`<b style="font-size:12px">${display_name}</b>`, { maxWidth: 220 }).openPopup();
        markerRef.current = marker;

        mapInstanceRef.current.flyTo(latlng, 13, { duration: 1.2 });
      } catch (err) {
        if (err.name !== 'AbortError') setNotFound(true);
      }
    }, 700); // debounce 700ms

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [location, mapReady]);

  return (
    <div className="relative h-48 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
      <div ref={mapRef} className="w-full h-full" />

      {/* Placeholder overlay when no location entered */}
      {!location?.trim() && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 bg-gray-100/90 pointer-events-none">
          <IconMap />
          <span className="text-xs font-semibold tracking-widest uppercase">Map Preview</span>
          <span className="text-xs text-gray-400">Enter a location above to preview</span>
        </div>
      )}

      {/* Not found notice */}
      {notFound && location?.trim() && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full shadow pointer-events-none">
          Location not found on map
        </div>
      )}
    </div>
  );
}

const ALL_THEMES = [
  { value: 'modern', color: 'from-violet-600 to-purple-900', label: 'Modern' },
  { value: 'academic', color: 'from-blue-800 to-yellow-600', label: 'Academic' },
  { value: 'techno', color: 'from-blue-600 to-blue-900', label: 'Techno' },
  { value: 'vibrant', color: 'from-pink-500 via-purple-500 to-indigo-600', label: 'Vibrant' },
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [planName, setPlanName] = useState(null); // e.g. 'Medium', 'Premium'
  const fileRef = useRef();

  // Fetch the client's active plan so we can apply Medium-plan restrictions.
  useEffect(() => {
    api.get('/api/payments/status/')
      .then(({ data }) => {
        const name = data.plan_details?.name || null;
        setPlanName(name);
      })
      .catch(() => setPlanName(null));
  }, []);

  const isMediumPlan = planName?.toLowerCase() === 'medium';

  const [form, setForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    max_capacity: '',
    ticket_type: 'free',
    price: '',
    ccp_number: '',
    theme: 'modern',
  });

  // When the plan loads as Medium, lock the theme to 'vibrant'.
  useEffect(() => {
    if (isMediumPlan) {
      setForm((f) => ({ ...f, theme: 'vibrant' }));
    }
  }, [isMediumPlan]);

  const pct = step === 1 ? 33 : step === 2 ? 66 : 100;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.start_date || !form.location || !form.max_capacity) {
      toast.error('Please fill in all required fields (title, description, date, location, capacity)');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('date', form.start_date);
      formData.append('location', form.location);
      formData.append('max_capacity', form.max_capacity);
      formData.append('theme', form.theme);
      formData.append('ticket_type', form.ticket_type);
      if (form.ticket_type === 'paid') {
        formData.append('price', form.price || '0');
        formData.append('ccp_number', form.ccp_number || '');
      }
      if (logoFile) formData.append('logo', logoFile);

      // Do NOT pass a Content-Type header — the axios interceptor in utils/axios.js
      // detects FormData and removes the default 'application/json' header so the
      // browser can set 'multipart/form-data; boundary=...' automatically.
      await api.post('/api/events/', formData);
      toast.success('🎉 Event created! It will go live once an admin approves it.');
      navigate('/client');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        // Surface each field-level validation error from DRF
        const msgs = Object.entries(data).map(
          ([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`
        );
        msgs.forEach((m) => toast.error(m));
      } else {
        toast.error(data?.detail || `Failed to create event (${err.response?.status ?? 'network error'})`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Progress card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">{step}</div>
              <span className="font-bold text-gray-900">
                {step === 1 ? 'Event Info' : step === 2 ? 'Tickets' : 'Review'}
              </span>
            </div>
            <span className="text-sm font-semibold text-primary">{pct}% Completed</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            {STEPS.map((s) => (
              <span key={s.number} className={step >= s.number ? 'text-primary font-medium' : ''}>{s.label}</span>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Info ── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create New Event</h2>
              <p className="text-gray-500 mb-8">Start by providing the essential details for your event.</p>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Annual Tech Conference 2024"
                    className="input"
                  />
                </div>

                {/* Banner upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event photo / Logo</label>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                      logoPreview ? 'border-primary bg-primary/5' : 'border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10'
                    }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileDrop} />
                    {logoPreview ? (
                      <img src={logoPreview} alt="preview" className="max-h-32 mx-auto rounded-xl object-contain" />
                    ) : (
                      <>
                        <IconUpload />
                        <p className="mt-3 font-medium text-gray-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG or SVG (max. 800×400px)</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your event goals and agenda..."
                    className="input resize-none"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date & Time</label>
                    <input name="start_date" type="datetime-local" value={form.start_date} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date & Time</label>
                    <input name="end_date" type="datetime-local" value={form.end_date} onChange={handleChange} className="input" />
                  </div>
                </div>

                {/* Location + Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <IconPin />
                      </span>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Enter venue address or city"
                        className="input pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Capacity</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <IconUsers />
                      </span>
                      <input
                        name="max_capacity"
                        type="number"
                        value={form.max_capacity}
                        onChange={handleChange}
                        placeholder="e.g. 500"
                        className="input pl-9"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Live Map Preview ── */}
                <MapPreview location={form.location} />
              </div>

              {/* Bottom actions */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate('/client')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!form.title || !form.description || !form.start_date || !form.location || !form.max_capacity) {
                      toast.error('Please fill in all required fields');
                      return;
                    }
                    setStep(2);
                  }}
                  className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Next: Tickets
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Tickets ── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Ticket Settings</h2>
              <p className="text-gray-500 mb-8">Configure the ticket type and pricing for your event.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Ticket Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['free', 'paid'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, ticket_type: t }))}
                        className={`p-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${
                          form.ticket_type === t
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {t === 'free' ? '🆓 Free Event' : '💳 Paid Event'}
                      </button>
                    ))}
                  </div>
                </div>

                {form.ticket_type === 'paid' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Price (DZD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-xs">DZD</span>
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          value={form.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="input pl-12"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">CCP Account Number</label>
                      <p className="text-xs text-gray-400 mb-2">Participants will use this number to send their payment before uploading the receipt.</p>
                      <input
                        name="ccp_number"
                        type="text"
                        value={form.ccp_number}
                        onChange={handleChange}
                        placeholder="e.g. 0012345 — clé 67"
                        className="input"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Theme</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ALL_THEMES.map((t) => {
                      const isLocked = isMediumPlan && t.value !== 'vibrant';
                      const isSelected = form.theme === t.value;
                      return (
                        <div key={t.value} className="relative">
                          <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => !isLocked && setForm((f) => ({ ...f, theme: t.value }))}
                            className={`w-full rounded-xl overflow-hidden border-2 transition-all ${
                              isLocked
                                ? 'border-transparent opacity-40 cursor-not-allowed'
                                : isSelected
                                ? 'border-primary'
                                : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <div className={`h-12 bg-gradient-to-br ${t.color}`} />
                            <p className="text-xs font-medium p-1.5 text-center bg-white">{t.label}</p>
                          </button>
                          {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-lg">🔒</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Medium plan restriction notice */}
                  {isMediumPlan && (
                    <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <span className="text-amber-500 text-base shrink-0 mt-0.5">⚠️</span>
                      <p className="text-xs text-amber-700 font-medium leading-relaxed">
                        <span className="font-bold">Medium Plan:</span> Restricted to Vibrant Theme only.
                        {' '}<span className="underline cursor-pointer" onClick={() => navigate('/client/plans')}>Upgrade your plan</span> to unlock more designs.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Next: Review
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Review ── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Review & Submit</h2>
              <p className="text-gray-500 mb-8">Double-check your event details before submitting for approval.</p>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                {[
                  { label: 'Event Title', value: form.title },
                  { label: 'Description', value: form.description || '—' },
                  { label: 'Start Date', value: form.start_date ? new Date(form.start_date).toLocaleString() : '—' },
                  { label: 'End Date', value: form.end_date ? new Date(form.end_date).toLocaleString() : '—' },
                  { label: 'Location', value: form.location },
                  { label: 'Max Capacity', value: form.max_capacity },
                  { label: 'Ticket Type', value: form.ticket_type === 'paid' ? `Paid — DZD ${form.price}` : 'Free' },
                  { label: 'Theme', value: form.theme },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-gray-900 capitalize max-w-xs text-right">{value}</span>
                  </div>
                ))}
              </div>

              {/* Map in review step too */}
              {form.location && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Location Preview</p>
                  <MapPreview location={form.location} />
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setStep(2)} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-primary text-white font-semibold px-8 py-2.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : '🚀 Submit for Approval'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
