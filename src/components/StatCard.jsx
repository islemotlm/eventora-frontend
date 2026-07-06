import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon, color = 'text-primary', bgColor = 'bg-primary/10' }) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card flex items-center gap-4 group hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold tracking-tight">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}
