'use client';

import { useState, useEffect } from 'react';

const photoCache = new Map<string, string | null>();

interface PlacePhotoProps {
  coordinates?: { lat: number; lng: number };
  name?: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export function PlacePhoto({ coordinates, name, className = '', fallbackIcon }: PlacePhotoProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    // Need at least coordinates OR name to search
    if (!coordinates && !name) return;

    const cacheKey = coordinates
      ? `${coordinates.lat},${coordinates.lng},${name || ''}`
      : `name:${name}`;

    if (photoCache.has(cacheKey)) {
      setPhotoUrl(photoCache.get(cacheKey) || null);
      return;
    }

    const params = new URLSearchParams();
    if (coordinates) {
      params.set('lat', String(coordinates.lat));
      params.set('lng', String(coordinates.lng));
    }
    if (name) params.set('name', name);

    fetch(`/api/places/photo?${params}`)
      .then(res => res.json())
      .then(data => {
        photoCache.set(cacheKey, data.photoUrl || null);
        setPhotoUrl(data.photoUrl || null);
      })
      .catch(() => {
        photoCache.set(cacheKey, null);
      });
  }, [coordinates, name]);

  if (!photoUrl || errored) {
    if (fallbackIcon) {
      return <div className={`bg-muted flex items-center justify-center ${className}`}>{fallbackIcon}</div>;
    }
    return null;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt={name || 'Place photo'}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </div>
  );
}
