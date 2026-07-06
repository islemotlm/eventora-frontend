import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ title = 'Nothing here yet', message = '', action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-primary/5 flex items-center justify-center animate-float-slow">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <rect x="10" y="14" width="40" height="32" rx="6" fill="#6C47FF" fillOpacity="0.1" stroke="#6C47FF" strokeWidth="1.5" />
            <line x1="18" y1="26" x2="42" y2="26" stroke="#6C47FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <line x1="18" y1="33" x2="34" y2="33" stroke="#6C47FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            <circle cx="47" cy="14" r="6" fill="#6C47FF" fillOpacity="0.15" stroke="#6C47FF" strokeWidth="1.5" />
            <path d="M45 14h4M47 12v4" stroke="#6C47FF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary/10 animate-pulse" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1.5">{title}</h3>
      {message && <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-5">{message}</p>}
      {action}
    </motion.div>
  );
}
