import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const PLAN_ICONS = ['🚀', '⚡', '👑'];
const PLAN_GRADIENTS = [
  'from-blue-500/10 to-violet-500/10',
  'from-primary/10 to-violet-600/10',
  'from-violet-600/10 to-accent/10',
];
const PLAN_BORDERS = [
  'hover:border-blue-400/60',
  'hover:border-primary/60',
  'hover:border-accent/60',
];
const PLAN_SHADOW = [
  'hover:shadow-[0_16px_48px_rgba(99,102,241,0.18)]',
  'hover:shadow-[0_16px_48px_rgba(124,58,237,0.2)]',
  'hover:shadow-[0_16px_48px_rgba(0,212,170,0.18)]',
];
const BTN_COLORS = [
  'from-blue-500 to-violet-500',
  'from-primary to-violet-600',
  'from-violet-600 to-accent',
];

export default function PlanSelection() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/api/plans/');
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : Array.isArray(raw?.results) ? raw.results : [];
        setPlans(list);
      } catch (err) {
        toast.error(err.response?.data?.detail || 'Failed to load plans. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f7ff]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-medium">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f8f7ff] overflow-y-auto relative">
      {/* Background orbs */}
      <div className="orb orb-purple w-96 h-96 top-0 right-0 opacity-50" />
      <div className="orb orb-teal w-80 h-80 bottom-0 left-0 opacity-40" />

      <div className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-primary/[0.08] border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.18em]">Choose Your Plan</span>
            </div>
            <h1
              className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Start creating{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
                amazing events
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
              Select the plan that fits your needs and unlock event creation on Eventora.
            </p>
          </motion.div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Override client-visible plan prices to match subscription pricing */}
            {plans.map((plan, index) => {
              const PRICE_MAP = {
                Medium: '500',
                Premium: '2 000',
                Pro: '3 000',
              };
              const displayPlan = { ...plan, price: PRICE_MAP[plan.name] ?? plan.price };
              const isPopular = index === 1;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 28, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className={`relative bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden flex flex-col
                    ${isPopular
                      ? 'border-primary shadow-[0_8px_40px_rgba(124,58,237,0.2)]'
                      : `border-gray-100 shadow-[0_4px_24px_rgba(108,71,255,0.07)] ${PLAN_BORDERS[index]}`
                    }
                    ${PLAN_SHADOW[index]}
                  `}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-violet-600 py-2 text-center">
                      <span className="text-xs font-bold text-white uppercase tracking-[0.14em]">✦ Most Popular</span>
                    </div>
                  )}

                  {/* Card gradient top */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${BTN_COLORS[index]} ${isPopular ? 'mt-8' : ''}`} />

                  <div className="p-8 flex flex-col flex-1">
                    {/* Icon + Name */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${PLAN_GRADIENTS[index]} flex items-center justify-center text-2xl`}>
                        {PLAN_ICONS[index % PLAN_ICONS.length]}
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                          {displayPlan.name || plan.name}
                          </h2>
                        <p className="text-xs text-gray-400 font-medium">One-time payment</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 mb-7">
                      <span
                        className="text-4xl font-extrabold text-gray-900"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {displayPlan.price}
                      </span>
                      <span className="text-gray-400 font-semibold text-sm">DZD</span>
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-3 mb-8">
                      {plan.features && Object.entries(plan.features).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${PLAN_GRADIENTS[index]} flex items-center justify-center shrink-0`}>
                            <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-600 capitalize">
                            {typeof val === 'boolean' ? (val ? key.replace('_', ' ') : '') : `${val} ${key}`}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => navigate('/client/payment', { state: { plan: displayPlan } })}
                      className={`w-full py-3.5 px-4 rounded-2xl font-bold text-white text-sm
                        bg-gradient-to-r ${BTN_COLORS[index]}
                        shadow-[0_4px_16px_rgba(124,58,237,0.25)]
                        hover:shadow-[0_8px_28px_rgba(124,58,237,0.35)]
                        hover:-translate-y-0.5 transition-all duration-300`}
                    >
                      Select {displayPlan.name || plan.name} →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-gray-400 mt-10"
          >
            Payments are reviewed by admins within 24 hours. You'll be notified once approved.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
