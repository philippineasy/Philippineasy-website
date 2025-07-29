'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CookieBanner = () => {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [adsConsent, setAdsConsent] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setBannerVisible(true);
    } else {
      loadScripts();
    }
  }, []);

  const acceptAllCookies = () => {
    const consent = {
      analytics: true,
      ads: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    closeBanner();
    loadScripts();
  };

  const rejectAllCookies = () => {
    const consent = {
      analytics: false,
      ads: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    closeBanner();
  };

  const customizeCookies = () => {
    setBannerVisible(false);
    setSettingsVisible(true);
  };

  const saveCustomCookies = () => {
    const consent = {
      analytics: analyticsConsent,
      ads: adsConsent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    closeBanner();
    loadScripts();
  };

  const closeBanner = () => {
    setBannerVisible(false);
    setSettingsVisible(false);
  };

  const loadScripts = () => {
    const consent = JSON.parse(localStorage.getItem('cookieConsent') || '{}');
    if (consent.analytics) {
      // Placeholder for analytics scripts (e.g., Google Analytics)
      console.log('Loading analytics scripts...');
    }
    if (consent.ads) {
      // Placeholder for advertising scripts (e.g., Google AdSense)
      console.log('Loading ads scripts...');
    }
  };
  
  // Function to be called from other parts of the app, e.g., the footer link
  const openCookieSettings = () => {
    setSettingsVisible(true);
  };

  // Expose the function to the window object to be called from anywhere
  useEffect(() => {
    (window as any).openCookieSettings = openCookieSettings;
    return () => {
      (window as any).openCookieSettings = null;
    };
  }, []);


  if (!bannerVisible && !settingsVisible) {
    return null;
  }

  return (
    <>
      {bannerVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-accent text-accent-foreground p-4 shadow-lg z-50">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center md:text-left">
              Ce site utilise des cookies pour améliorer votre expérience, mesurer l’audience et afficher des publicités personnalisées.
              <Link href="/confidentialite" className="underline hover:text-white ml-1">En savoir plus</Link>
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={acceptAllCookies} className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Tout accepter
              </button>
              <button onClick={rejectAllCookies} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Tout refuser
              </button>
              <button onClick={customizeCookies} className="bg-transparent border border-accent-foreground hover:bg-accent-foreground/10 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Personnaliser
              </button>
            </div>
          </div>
        </div>
      )}

      {settingsVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background text-foreground rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Personnalisez vos préférences</h3>
                <div className="space-y-4">
                    <label className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">Cookies statistiques</span>
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={analyticsConsent}
                            onChange={(e) => setAnalyticsConsent(e.target.checked)}
                        />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">Cookies publicitaires</span>
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={adsConsent}
                            onChange={(e) => setAdsConsent(e.target.checked)}
                        />
                    </label>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={saveCustomCookies} className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Valider mes choix
                    </button>
                     <button onClick={closeBanner} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
