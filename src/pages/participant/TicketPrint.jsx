import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function TicketPrint() {
  const { id } = useParams();
  const [reg, setReg] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  useEffect(() => {
    api.get(`/api/my-registrations/${id}/`)
      .then(({ data }) => setReg(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!reg) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-semibold">Ticket not found.</p>
        </div>
      </div>
    );
  }

  const ticketId = `EV-${String(reg.id).padStart(4, '0')}-X${String(Math.abs(reg.id * 21) % 1000).padStart(3, '0')}`;
  const eventDate = reg.event?.date ? new Date(reg.event.date) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen bg-[#f8f7ff] relative overflow-hidden">
      {/* ── Background Orbs (hidden on actual print) ── */}
      <div className="no-print orb orb-purple w-96 h-96 top-[-100px] left-[-100px] opacity-40" />
      <div className="no-print orb orb-teal w-[500px] h-[500px] bottom-[-200px] right-[-200px] opacity-30" />

      {/* ── Print controls (hidden on actual print) ── */}
      <div className="no-print bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between relative z-10">
        <div>
          <h1 className="font-bold text-gray-900 text-lg">Ticket Preview</h1>
          <p className="text-gray-400 text-sm">A4 Landscape Orientation</p>
        </div>
        <button
          onClick={handlePrint}
          className="pill-btn flex items-center gap-2 px-6 py-2.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Download PDF / Print
        </button>
      </div>

      {/* ── Ticket (printable area) ── */}
      <div className="flex justify-center py-8 px-4 relative z-10">
        <div
          ref={printRef}
          id="ticket-print"
          className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(108,71,255,0.16)] overflow-hidden flex print:shadow-none"
          style={{ width: '900px', minHeight: '360px' }}
        >
          {/* Left panel — purple */}
          <div
            className="w-56 shrink-0 flex flex-col justify-between p-7 text-white"
            style={{ background: '#6C47FF' }}
          >
            {/* Logo */}
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-5 h-5">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-sm tracking-wider">EVENTORA</p>
                  <p className="text-white/50 text-xs tracking-wide">OFFICIAL TICKET</p>
                </div>
              </div>
            </div>

            {/* Middle — verified access */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4 opacity-70">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Verified Access</span>
              </div>
              <div>
                <p className="text-4xl font-black leading-none">YOUR</p>
                <p className="text-4xl font-black leading-none">TICKET</p>
              </div>
            </div>

            {/* Bottom — ticket ID */}
            <div className="border-t border-white/20 pt-4">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Ticket ID</p>
              <p className="font-mono font-bold text-sm text-white">{ticketId}</p>
            </div>
          </div>

          {/* Right panel — white */}
          <div className="flex-1 p-7 flex flex-col justify-between">
            {/* Top row */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                {/* Confirmed badge */}
                <div className="inline-flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirmed Attendee</span>
                </div>

                {/* Participant name */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Participant Name</p>
                  <p className="text-3xl font-extrabold text-gray-900">
                    {reg.user?.first_name || 'Participant'} {reg.user?.last_name || ''}
                  </p>
                </div>

                {/* Event name */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Event</p>
                  <p className="text-xl font-bold text-violet-600 leading-snug max-w-lg">{reg.event?.title}</p>
                </div>
              </div>

              {/* Event logo / QR placeholder top */}
              <div className="shrink-0">
                {reg.event?.logo ? (
                  <div className="w-24 h-24 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <img src={`${API_BASE}${reg.event.logo}`} alt={reg.event.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="1.5" className="w-10 h-10 opacity-30">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200 my-5" />

            {/* Bottom info grid + QR */}
            <div className="flex items-end gap-6">
              <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
                {/* Date & Time */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="2" className="w-3.5 h-3.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{formattedDate}</p>
                  <p className="text-xs text-gray-400 mt-0.5">09:00 AM – 05:00 PM</p>
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="2" className="w-3.5 h-3.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{reg.event?.location || '—'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{reg.event?.location}</p>
                </div>

                {/* Seat / Row */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="2" className="w-3.5 h-3.5">
                      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
                    </svg>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Seat / Row</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">Main Hall • Row B-{reg.id % 20 + 1}</p>
                </div>

                {/* Admission */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="2" className="w-3.5 h-3.5">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admission</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm capitalize">
                    {reg.event?.ticket_type === 'free' ? 'General Access' : 'VIP Delegate Access'}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                {reg.qr_code ? (
                  <>
                    <div className="w-24 h-24 rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-white p-1">
                      <img src={`${API_BASE}${reg.qr_code}`} alt="QR Code" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Scan for entry</p>
                    <p className="text-xs text-gray-300 uppercase tracking-widest">Powered by Eventora Systems</p>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 p-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" className="w-8 h-8">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" /><rect x="5" y="5" width="3" height="3" />
                        <rect x="16" y="5" width="3" height="3" /><rect x="5" y="16" width="3" height="3" />
                      </svg>
                      <span className="text-gray-300 text-center" style={{ fontSize: '8px', lineHeight: '1.2' }}>QR N/A</span>
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">QR Unavailable</p>
                    <p className="text-xs text-gray-300 uppercase tracking-widest">Medium Plan · No QR</p>
                  </>
                )}
              </div>
            </div>

            {/* Non-transferable notice */}
            <p className="text-xs text-gray-300 uppercase tracking-wide mt-4">
              This ticket is non-transferable and must be presented with valid ID.
            </p>
          </div>
        </div>
      </div>

      {/* Print hint */}
      <p className="no-print text-center text-sm text-gray-400 pb-8">
        For best results, select <strong>Landscape</strong> orientation in your print settings.
      </p>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #ticket-print {
            width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-inside: avoid;
          }
        }
        @page { size: A4 landscape; margin: 10mm; }
      `}</style>
    </div>
  );
}
