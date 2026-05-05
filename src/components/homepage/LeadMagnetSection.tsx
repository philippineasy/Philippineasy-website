'use client';

import { useState, type ReactElement } from 'react';
import { trackGenerateLead, trackNewsletterSignup } from '@/lib/analytics';
import { metaTrackLead } from '@/lib/meta-pixel';

type GuideId = 'palawan' | 'visa' | 'budget';

type Guide = {
  id: GuideId;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  file: string;
  Cover: () => ReactElement;
};

/* --- SVG covers --- */

const PalawanCover = () => (
  <svg
    viewBox="0 0 400 160"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full"
    role="img"
    aria-label="Illustration des îles karstiques de Palawan avec soleil jaune"
  >
    <defs>
      <linearGradient id="palSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0891b2" />
        <stop offset="100%" stopColor="#164e63" />
      </linearGradient>
    </defs>
    <rect width="400" height="160" fill="url(#palSky)" />
    <circle cx="310" cy="48" r="22" fill="#FCD34D" />
    <circle cx="310" cy="48" r="34" fill="#FCD34D" opacity="0.18" />
    {/* îles karstiques */}
    <path
      d="M0 120 Q 20 100, 42 106 Q 60 90, 80 100 Q 100 84, 118 96 Q 140 82, 160 98 L 160 160 L 0 160 Z"
      fill="#0e7490"
      opacity="0.85"
    />
    <path
      d="M150 128 Q 180 108, 210 118 Q 240 98, 270 114 Q 300 100, 330 118 L 330 160 L 150 160 Z"
      fill="#155e75"
      opacity="0.9"
    />
    <path
      d="M280 132 Q 310 116, 340 124 Q 370 110, 400 124 L 400 160 L 280 160 Z"
      fill="#0c4a6e"
    />
    {/* reflets eau */}
    <g stroke="#ffffff" strokeWidth="1" opacity="0.25">
      <path d="M20 142 L 60 142" />
      <path d="M90 150 L 140 150" />
      <path d="M200 146 L 250 146" />
      <path d="M300 152 L 360 152" />
    </g>
  </svg>
);

const VisaCover = () => (
  <svg
    viewBox="0 0 400 160"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full"
    role="img"
    aria-label="Illustration d'une checklist avec coches orange"
  >
    <defs>
      <linearGradient id="visaBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B5BDB" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
    </defs>
    <rect width="400" height="160" fill="url(#visaBg)" />
    {/* papier */}
    <rect
      x="120"
      y="20"
      width="160"
      height="140"
      rx="6"
      fill="#ffffff"
      opacity="0.97"
    />
    <rect
      x="120"
      y="20"
      width="160"
      height="18"
      rx="6"
      fill="#F4F7FE"
    />
    {/* header */}
    <rect x="132" y="27" width="60" height="4" rx="2" fill="#3B5BDB" />
    {/* lignes checklist */}
    <g>
      {[52, 72, 92, 112, 132].map((y, i) => (
        <g key={y}>
          <rect
            x="132"
            y={y - 6}
            width="14"
            height="14"
            rx="3"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {i < 3 && (
            <path
              d={`M 135 ${y} L 138 ${y + 3} L 143 ${y - 3}`}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          <rect
            x="154"
            y={y - 3}
            width={i === 0 ? 100 : i === 1 ? 80 : i === 2 ? 110 : i === 3 ? 70 : 90}
            height="5"
            rx="2"
            fill={i < 3 ? '#94a3b8' : '#cbd5e1'}
          />
        </g>
      ))}
    </g>
  </svg>
);

const BudgetCover = () => (
  <svg
    viewBox="0 0 400 160"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full"
    role="img"
    aria-label="Illustration d'un tableau de budget avec total 1 750 €"
  >
    <defs>
      <linearGradient id="budgetBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    <rect width="400" height="160" fill="url(#budgetBg)" />
    {/* carte tableau */}
    <rect
      x="80"
      y="22"
      width="240"
      height="116"
      rx="8"
      fill="#ffffff"
      opacity="0.97"
    />
    {/* header bar */}
    <rect
      x="80"
      y="22"
      width="240"
      height="22"
      rx="8"
      fill="#fef3c7"
    />
    <rect x="80" y="34" width="240" height="10" fill="#fef3c7" />
    <text
      x="92"
      y="38"
      fontFamily="Poppins, system-ui, sans-serif"
      fontSize="10"
      fontWeight="700"
      fill="#78350f"
      style={{ letterSpacing: '0.06em' }}
    >
      BUDGET · 3 SEMAINES
    </text>
    {/* lignes */}
    <g
      fontFamily="Poppins, system-ui, sans-serif"
      fontSize="11"
      fill="#334155"
    >
      <text x="92" y="66">Vols</text>
      <text x="290" y="66" textAnchor="end" fontWeight="600">800€</text>
      <line x1="92" y1="72" x2="308" y2="72" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="92" y="88">Hébergement</text>
      <text x="290" y="88" textAnchor="end" fontWeight="600">650€</text>
      <line x1="92" y1="94" x2="308" y2="94" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="92" y="110">Nourriture</text>
      <text x="290" y="110" textAnchor="end" fontWeight="600">300€</text>
      <line x1="92" y1="116" x2="308" y2="116" stroke="#e5e7eb" strokeWidth="0.6" />
    </g>
    {/* total */}
    <g>
      <rect x="92" y="122" width="216" height="10" rx="3" fill="#fef3c7" />
      <text
        x="98"
        y="130"
        fontFamily="Poppins, system-ui, sans-serif"
        fontSize="10"
        fontWeight="700"
        fill="#78350f"
      >
        TOTAL
      </text>
      <text
        x="302"
        y="130"
        textAnchor="end"
        fontFamily="Poppins, system-ui, sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="#78350f"
      >
        1 750€
      </text>
    </g>
  </svg>
);

const guides: Guide[] = [
  {
    id: 'palawan',
    badge: 'Guide PDF',
    badgeColor: '#0891b2',
    title: '7 jours à Palawan',
    description: 'El Nido, Coron, plages secrètes & budget détaillé.',
    file: '/lead-magnets/palawan-7-jours.pdf',
    Cover: PalawanCover,
  },
  {
    id: 'visa',
    badge: 'Checklist',
    badgeColor: '#3B5BDB',
    title: 'Checklist Visa SRRV',
    description: 'Documents, étapes, coûts — tout pour votre visa retraite.',
    file: '/lead-magnets/checklist-visa-srrv.pdf',
    Cover: VisaCover,
  },
  {
    id: 'budget',
    badge: 'Budget',
    badgeColor: '#F59E0B',
    title: 'Budget 3 semaines',
    description: 'Vols, hébergement, nourriture, transport — guide complet.',
    file: '/lead-magnets/budget-3-semaines.pdf',
    Cover: BudgetCover,
  },
];

const DocIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const WalletIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <path d="M16 13h4M4 7V5a2 2 0 0 1 2-2h10" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5M12 15V3" />
  </svg>
);

const badgeIconFor = (id: GuideId) => {
  if (id === 'palawan') return <DocIcon />;
  if (id === 'visa') return <CheckIcon />;
  return <WalletIcon />;
};

export const LeadMagnetSection = () => {
  const [selectedGuide, setSelectedGuide] = useState<GuideId | null>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !selectedGuide) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok || res.status === 200) {
        setStatus('success');
        setMessage('Téléchargement en cours…');
        trackGenerateLead({ form_name: `lead_magnet_${selectedGuide}` });
        trackNewsletterSignup({ source: 'lead_magnet' });
        metaTrackLead({ content_name: `Lead Magnet ${selectedGuide}` });
        const guide = guides.find((g) => g.id === selectedGuide);
        if (guide) {
          const link = document.createElement('a');
          link.href = guide.file;
          link.download = guide.file.split('/').pop() || 'guide.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setTimeout(() => {
          setMessage('Guide téléchargé ! Vérifiez aussi votre boîte mail.');
          setEmail('');
        }, 1500);
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setStatus('error');
      setMessage('Erreur de connexion.');
    }
  };

  const handleGuideClick = (id: GuideId) => {
    setSelectedGuide(id);
    setStatus('idle');
    setMessage('');
    setTimeout(() => {
      document.getElementById('lead-magnet-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  return (
    <section className="py-20 md:py-24 bg-soft-blue">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            Guides <span className="text-accent">gratuits</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Préparez votre voyage avec nos guides pratiques. Téléchargez-les
            gratuitement en 2 clics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {guides.map((guide) => {
            const isSelected = selectedGuide === guide.id;
            return (
              <article
                key={guide.id}
                className={`group bg-card rounded-2xl overflow-hidden flex flex-col transition-all duration-200 ${
                  isSelected
                    ? 'shadow-xl -translate-y-1'
                    : 'hover:-translate-y-1 hover:shadow-lg'
                }`}
                style={{
                  border: isSelected
                    ? `1px solid ${guide.badgeColor}`
                    : '0.5px solid #e5e7eb',
                  boxShadow: isSelected
                    ? undefined
                    : '0 1px 2px rgba(0,0,0,0.03)',
                }}
              >
                <div className="relative w-full h-[160px] overflow-hidden">
                  <guide.Cover />
                </div>
                <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1">
                  <span
                    className="inline-flex items-center gap-1.5 self-start mb-3 px-2 py-0.5 rounded"
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: guide.badgeColor,
                      backgroundColor: `${guide.badgeColor}14`,
                    }}
                  >
                    <span style={{ color: guide.badgeColor }}>
                      {badgeIconFor(guide.id)}
                    </span>
                    {guide.badge}
                  </span>
                  <h3
                    className="text-[16px] text-foreground mb-2"
                    style={{ fontWeight: 600, letterSpacing: '-0.01em' }}
                  >
                    {guide.title}
                  </h3>
                  <p
                    className="text-[13px] mb-4 flex-1"
                    style={{ color: '#64748b', lineHeight: 1.55 }}
                  >
                    {guide.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleGuideClick(guide.id)}
                    className="inline-flex items-center gap-2 self-start text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                    aria-label={`Télécharger le guide ${guide.title}`}
                  >
                    <DownloadIcon />
                    Télécharger gratuitement
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Email gate */}
        {selectedGuide && (
          <div
            id="lead-magnet-form"
            className="mt-10 max-w-xl mx-auto"
          >
            {status === 'success' ? (
              <div
                className="text-center p-6 rounded-xl bg-card"
                style={{ border: '1px solid #d1fae5' }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3" style={{ backgroundColor: '#d1fae5' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className="font-semibold text-foreground">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card rounded-xl p-5" style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                <p className="text-[13px] text-muted-foreground mb-3">
                  Recevez <strong className="text-foreground font-semibold">{guides.find((g) => g.id === selectedGuide)?.title}</strong> gratuitement par email.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    disabled={status === 'loading'}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {status === 'loading' ? 'Envoi…' : (
                      <>
                        <DownloadIcon />
                        Télécharger
                      </>
                    )}
                  </button>
                </div>
                {status === 'error' && (
                  <p className="text-[13px] text-destructive mt-3">{message}</p>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
