'use client';

import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/68898021711618192cf5c36b/1j1chp1lr';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode?.insertBefore(s1, s0);
  }, []);

  return null;
};

export default TawkToChat;
