'use client';

import { useEffect } from 'react';
import { trackProductView } from './actions';

type ProductViewTrackerProps = {
  productId: number;
};

export function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  useEffect(() => {
    // We track the view only once per page load.
    trackProductView(productId);
  }, [productId]);

  return null; // This component does not render anything.
}
