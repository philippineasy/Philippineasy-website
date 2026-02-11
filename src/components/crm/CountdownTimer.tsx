'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  expiresAt: string;
  label?: string;
  className?: string;
}

function getTimeRemaining(expiresAt: string) {
  const now = new Date().getTime();
  const target = new Date(expiresAt).getTime();
  const diff = target - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, expired: false };
}

function formatRemaining(time: ReturnType<typeof getTimeRemaining>) {
  if (time.expired) return 'Expiré';
  if (time.days > 0) return `${time.days}j ${time.hours}h restants`;
  if (time.hours > 0) return `${time.hours}h ${time.minutes}min restants`;
  return `${time.minutes}min restants`;
}

export default function CountdownTimer({ expiresAt, label, className }: CountdownTimerProps) {
  const [time, setTime] = useState(() => getTimeRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(expiresAt));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [expiresAt]);

  const isUrgent = !time.expired && time.days < 3;
  const isCritical = !time.expired && time.days === 0 && time.hours < 24;

  return (
    <span
      className={cn(
        'text-sm font-medium',
        time.expired && 'text-red-500',
        isUrgent && !time.expired && 'text-amber-500',
        isCritical && !time.expired && 'text-red-500 animate-pulse',
        !isUrgent && !time.expired && 'text-muted-foreground',
        className
      )}
    >
      {label && <span className="mr-1">{label} :</span>}
      {formatRemaining(time)}
    </span>
  );
}
