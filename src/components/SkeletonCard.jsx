import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-36 -mx-6 -mt-6 mb-5 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-2/3 rounded-lg" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
      <div className="mt-5 flex justify-between items-center">
        <div className="skeleton h-1.5 w-20 rounded-full" />
        <div className="skeleton h-9 w-20 rounded-xl" />
      </div>
    </div>
  );
}
