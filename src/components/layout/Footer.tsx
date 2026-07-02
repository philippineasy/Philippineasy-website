'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faInstagram,
  faYoutube,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons';
import { trackNewsletterSignup } from '@/lib/analytics';
import { metaTrackLead } from '@/lib/meta-pixel';

type FooterLink = { label: string; href: string };

const footerCols: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Voyager',
    links: [
      { label: 'Palawan', href: '/voyager-aux-philippines/palawan' },
      { label: 'Cebu & Visayas', href: '/voyager-aux-philippines/cebu-visayas' },
      { label: 'Siargao', href: '/voyager-aux-philippines/siargao' },
      { label: 'Quand partir', href: '/voyager-aux-philippines/quand-partir' },
      { label: 'Itinéraires prêts à partir', href: '/itineraires-philippines' },
      { label: 'Itinéraire IA', href: '/itineraire-personnalise-pour-les-philippines' },
    ],
  },
  {
    title: "S'installer",
    links: [
      { label: 'Visas', href: '/vivre-aux-philippines/visas-et-formalites' },
      { label: 'Logement', href: '/vivre-aux-philippines/logement' },
      { label: 'Travailler', href: '/vivre-aux-philippines/travail-entreprise' },
      { label: 'Banque & Finances', href: '/vivre-aux-philippines/banque-finances' },
      { label: 'Culture & Études', href: '/vivre-aux-philippines/culture-integration' },
      { label: 'Santé & Assurances', href: '/vivre-aux-philippines/sante-assurances' },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { label: 'Forum', href: '/forum-sur-les-philippines' },
      { label: 'Rencontres', href: '/rencontre-philippines' },
      { label: 'Témoignages', href: '/' },
      { label: 'Buddy System', href: '/services#buddy' },
      { label: 'Pack Ultime', href: '/services#pack-ultime' },
    ],
  },
  {
    title: "Philippin'Easy",
    links: [
      // TODO: page /a-propos a creer
      { label: 'À propos', href: '/' },
      { label: 'Contact', href: '/contact' },
      // TODO: page /presse a creer
      { label: 'Presse', href: '/contact' },
      { label: 'Partenaires', href: '/partenaires' },
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Confidentialité', href: '/confidentialite' },
    ],
  },
];

const Footer = () => {
  const { profile } = useAuth();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus('success');
        setNewsletterMessage(data.message || 'Inscription confirmée. Vérifiez votre boîte mail.');
        setNewsletterEmail('');
        trackNewsletterSignup({ source: 'footer' });
        metaTrackLead({ content_name: 'Newsletter Footer' });
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMessage('Erreur de connexion.');
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-night text-slate-400 pt-16 pb-6 px-4">
      <div className="container mx-auto max-w-[1200px]">
        {/* Top : brand col + 4 nav cols */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_3fr] gap-12 pb-10 border-b border-white/10">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="inline-block text-[26px] font-bold text-white tracking-[-0.02em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              aria-label="Philippin'Easy — Accueil"
            >
              Philippin&apos;<span className="text-accent">Easy</span>
            </Link>

            <p className="text-[14px] leading-[1.6] mt-4 mb-5 max-w-[320px]">
              Le guide francophone #1 pour voyager, vivre et s&apos;installer
              dans l&apos;archipel aux 7&nbsp;641&nbsp;îles.
            </p>

            {/* Socials */}
            <div className="flex gap-2.5 mb-6">
              <a
                href="https://www.facebook.com/share/1RfoyAcYFU/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Philippin'Easy"
                className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white/[0.06] text-slate-400 hover:bg-accent hover:text-accent-foreground transition-all duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-[15px]" />
              </a>
              <a
                href="https://www.instagram.com/philippineseasy?igsh=MWYwNDg2eThiemdleg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Philippin'Easy"
                className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white/[0.06] text-slate-400 hover:bg-accent hover:text-accent-foreground transition-all duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-[15px]" />
              </a>
              <a
                href="https://t.me/philippineasy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram Philippin'Easy"
                className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white/[0.06] text-slate-400 hover:bg-accent hover:text-accent-foreground transition-all duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FontAwesomeIcon icon={faTelegram} className="text-[15px]" />
              </a>
              <a
                href="https://youtube.com/@philippineasy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Philippin'Easy"
                className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white/[0.06] text-slate-400 hover:bg-accent hover:text-accent-foreground transition-all duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FontAwesomeIcon icon={faYoutube} className="text-[15px]" />
              </a>
            </div>

            {/* Newsletter (compact, kept for revenue) */}
            <form onSubmit={handleNewsletterSubmit} className="max-w-[340px]">
              <label htmlFor="footer-newsletter-email" className="block text-[12px] uppercase tracking-[0.06em] font-semibold text-white/85 mb-2">
                Newsletter mensuelle
              </label>
              <div className="flex">
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus !== 'idle') setNewsletterStatus('idle');
                  }}
                  className="flex-1 px-3 min-h-[44px] bg-white/[0.06] text-white placeholder-slate-500 rounded-l-md border border-white/10 border-r-0 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                  placeholder="votre@email.com"
                  required
                  disabled={newsletterStatus === 'loading'}
                />
                <button
                  type="submit"
                  aria-label="S'inscrire à la newsletter"
                  className="px-4 min-h-[44px] bg-accent text-accent-foreground rounded-r-md hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  disabled={newsletterStatus === 'loading'}
                >
                  <FontAwesomeIcon
                    icon={
                      newsletterStatus === 'loading'
                        ? faSpinner
                        : newsletterStatus === 'success'
                        ? faCheck
                        : faPaperPlane
                    }
                    spin={newsletterStatus === 'loading'}
                    className="text-[14px]"
                  />
                </button>
              </div>
              {newsletterMessage && (
                <p
                  className={`text-[12px] mt-2 ${
                    newsletterStatus === 'success' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {newsletterMessage}
                </p>
              )}
            </form>
          </div>

          {/* Nav 4-cols block */}
          <nav aria-label="Navigation pied de page">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {footerCols.map((col) => (
                <div key={col.title}>
                  <h3 className="text-white text-[14px] font-bold mb-3.5">
                    {col.title}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-slate-400 text-[13px] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[12px]">
          <span className="text-slate-500">
            © {year} Philippin&apos;Easy. Tous droits réservés.
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-500">
            <Link href="/cgu" className="hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline">
              CGU
            </Link>
            <button
              type="button"
              onClick={() => (window as { openCookieSettings?: () => void }).openCookieSettings?.()}
              className="hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline"
            >
              Gestion des cookies
            </button>
            {profile && (profile.role === 'super_admin' || profile.role === 'editor') && (
              <Link href="/admin" className="hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline">
                Admin
              </Link>
            )}
          </div>
          <span className="text-slate-500">
            Fait avec <span className="text-accent">♥</span> à Cebu &amp; Paris.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
