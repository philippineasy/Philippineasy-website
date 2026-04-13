'use client';

import { useState, useEffect } from 'react';

const photoCache = new Map<string, string | null>();

export function usePlacePhoto(
  coordinates?: { lat: number; lng: number } | null,
  name?: string
): string | null {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!coordinates) return;

    const cacheKey = `${coordinates.lat},${coordinates.lng},${name || ''}`;
    if (photoCache.has(cacheKey)) {
      setPhotoUrl(photoCache.get(cacheKey) || null);
      return;
    }

    const params = new URLSearchParams({
      lat: String(coordinates.lat),
      lng: String(coordinates.lng),
    });
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

  return photoUrl;
}

// Batch version: fetch multiple photos at once
export function usePlacePhotos(
  items: Array<{ coordinates?: { lat: number; lng: number }; name?: string }> | undefined
): Map<string, string | null> {
  const [photos, setPhotos] = useState<Map<string, string | null>>(new Map());

  useEffect(() => {
    if (!items?.length) return;

    const toFetch = items.filter(item => {
      if (!item.coordinates) return false;
      const key = `${item.coordinates.lat},${item.coordinates.lng},${item.name || ''}`;
      return !photoCache.has(key);
    });

    if (toFetch.length === 0) {
      // All cached, build map
      const map = new Map<string, string | null>();
      items.forEach(item => {
        if (!item.coordinates) return;
        const key = `${item.coordinates.lat},${item.coordinates.lng},${item.name || ''}`;
        map.set(key, photoCache.get(key) || null);
      });
      setPhotos(map);
      return;
    }

    // Fetch in parallel with a small concurrency limit
    const fetchAll = async () => {
      const results = await Promise.allSettled(
        toFetch.slice(0, 8).map(async (item) => {
          const params = new URLSearchParams({
            lat: String(item.coordinates!.lat),
            lng: String(item.coordinates!.lng),
          });
          if (item.name) params.set('name', item.name);

          const res = await fetch(`/api/places/photo?${params}`);
          const data = await res.json();
          const key = `${item.coordinates!.lat},${item.coordinates!.lng},${item.name || ''}`;
          photoCache.set(key, data.photoUrl || null);
          return { key, url: data.photoUrl || null };
        })
      );

      const map = new Map<string, string | null>();
      items.forEach(item => {
        if (!item.coordinates) return;
        const key = `${item.coordinates.lat},${item.coordinates.lng},${item.name || ''}`;
        map.set(key, photoCache.get(key) || null);
      });
      setPhotos(map);
    };

    fetchAll();
  }, [items]);

  return photos;
}
