import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const POLL_INTERVAL_MS = 5000;

export default function PaymentStatus() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);
  const [checking, setChecking] = useState(false);
  const intervalRef = useRef(null);
  const previousStatusRef = useRef(null);

  const checkStatus = async (isManual = false) => {
    if (isManual) setChecking(true);
    try {
      const res = await api.get('/api/payments/status/', { params: { _t: Date.now() } });
      const data = res.data;
      if (previousStatusRef.current === 'pending' && data.status === 'approved' && !data.is_used) {
        toast.success('🎉 Your payment has been approved! Redirecting...');
        setPayment(data);
        clearInterval(intervalRef.current);
        setTimeout(() => navigate('/client/create'), 2000);
        return;
      }
      previousStatusRef.current = data.status;
      setPayment(data);
      setLastChecked(new Date());
      if (data.status === 'approved' && !data.is_used) { clearInterval(intervalRef.current); navigate('/client/create'); return; }
      if (data.status === 'rejected' || (data.status === 'approved' && data.is_used)) clearInterval(intervalRef.current);
    } catch (err) {
      if (err.response?.status === 404) { clearInterval(intervalRef.current); navigate('/client/plans'); }
      else toast.error('Could not reach the server. Retrying...');
    } finally {
      setLoading(false);
      if (isManual) setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    intervalRef.current = setInterval(() => {
      if (previousStatusRef.current === 'pending' || previousStatusRef.current === null) checkStatus();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f7ff]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-primary/70 font-medium">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (!payment) return null;

  return (
    <div className="flex-1 bg-[#f8f7ff] overflow-y-auto relative">
      {/* Background orbs */}
      <div className="orb orb-purple w-96 h-96 top-0 right-0 opacity-40" />
      <div className="orb orb-teal w-80 h-80 bottom-0 left-0 opacity-30" />

      <div className="relative z-10 py-16 px-6">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-[0_8px_48px_rgba(108,71,255,0.12)] border border-white text-center"
          >
            <AnimatePresence mode="wait">

              {/* ── PENDING ── */}
              {payment.status === 'pending' && (
                <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/10 border-2 border-amber-300/40 flex items-center justify-center mx-auto mb-6"
                  >
                    <svg className="w-9 h-9 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>

                  <h2 className="text-3xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Payment Under Review
                  </h2>
                  <p className="text-gray-500 mb-2 max-w-sm mx-auto leading-relaxed">
                    We received your receipt for the{' '}
                    <span className="font-bold text-gray-900">{payment.plan_details?.name} Plan</span>.
                    An administrator is reviewing it now.
                  </p>

                  {/* Live pulse indicator */}
                  <div className="flex items-center justify-center gap-2 my-6 bg-amber-50 border border-amber-200/60 rounded-full px-4 py-2 w-fit mx-auto">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                    <span className="text-xs text-amber-700 font-semibold">
                      Live · Checking every {POLL_INTERVAL_MS / 1000}s
                      {lastChecked && ` · ${lastChecked.toLocaleTimeString()}`}
                    </span>
                  </div>

                  <div className="flex gap-3 justify-center mt-4">
                    <button
                      onClick={() => checkStatus(true)}
                      disabled={checking}
                      className="pill-btn max-w-[160px] flex items-center gap-2 justify-center"
                    >
                      {checking
                        ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Checking...</>
                        : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Check Now</>
                      }
                    </button>
                    <button
                      onClick={() => navigate('/client/plans')}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors text-sm"
                    >
                      Back to Plans
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── APPROVED & UNUSED ── */}
              {payment.status === 'approved' && !payment.is_used && (
                <motion.div key="approved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400/20 to-accent/10 border-2 border-green-400/40 flex items-center justify-center mx-auto mb-6"
                  >
                    <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Payment Approved! 🎉
                  </h2>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Your <span className="font-bold text-gray-900">{payment.plan_details?.name} Plan</span> is active.
                    Time to create your event!
                  </p>
                  <button onClick={() => navigate('/client/create')} className="pill-btn max-w-xs mx-auto text-base">
                    Create Event Now →
                  </button>
                </motion.div>
              )}

              {/* ── REJECTED ── */}
              {payment.status === 'rejected' && (
                <motion.div key="rejected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-9 h-9 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Payment Rejected</h2>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Your receipt could not be verified. Please ensure the image is clear and the correct amount was transferred.
                  </p>
                  <button
                    onClick={() => navigate('/client/payment', { state: { plan: payment.plan_details } })}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-lg"
                  >
                    Re-upload Receipt
                  </button>
                </motion.div>
              )}

              {/* ── APPROVED & USED ── */}
              {payment.status === 'approved' && payment.is_used && (
                <motion.div key="used" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-9 h-9 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Plan Already Used</h2>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    This payment was already used to create an event. Select a new plan to create another.
                  </p>
                  <button onClick={() => navigate('/client/plans')} className="pill-btn max-w-xs mx-auto">
                    Select New Plan
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Plan info footer */}
          {payment.plan_details && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-xs text-gray-400 mt-5"
            >
              Plan: <strong className="text-gray-600">{payment.plan_details.name}</strong>
              {' · '}{payment.plan_details.price} DZD
              {' · '}Submitted {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : '—'}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
