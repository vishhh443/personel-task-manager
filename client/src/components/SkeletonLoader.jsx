import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="space-y-4 w-full" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden relative"
        >
          {/* Skeleton task details */}
          <div className="space-y-3 flex-1 w-full">
            <div className="h-5 w-1/3 rounded bg-white/5 animate-shimmer" />
            <div className="space-y-2 w-full">
              <div className="h-4 w-full rounded bg-white/5 animate-shimmer" />
              <div className="h-4 w-2/3 rounded bg-white/5 animate-shimmer" />
            </div>
            
            {/* Meta skeleton details */}
            <div className="flex gap-4 pt-1">
              <div className="h-4 w-20 rounded bg-white/5 animate-shimmer" />
              <div className="h-4 w-24 rounded bg-white/5 animate-shimmer" />
            </div>
          </div>

          {/* Skeleton action controllers */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end md:justify-start border-t border-white/5 md:border-t-0 pt-3 md:pt-0">
            <div className="h-8 w-12 rounded-lg bg-white/5 animate-shimmer" />
            <div className="h-8 w-8 rounded-lg bg-white/5 animate-shimmer" />
            <div className="h-8 w-8 rounded-lg bg-white/5 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
