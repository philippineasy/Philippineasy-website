'use client';

import { useEffect, useState } from 'react';

const fmt = () =>
  new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Manila',
  });

export function LiveManilaTime() {
  const [time, setTime] = useState<string>('--:--');

  useEffect(() => {
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time}</span>;
}
