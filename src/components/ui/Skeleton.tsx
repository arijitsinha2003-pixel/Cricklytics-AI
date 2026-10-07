import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-800/60 ${className}`} />
  );
};
