'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload, faEnvelope, faCheck, faSpinner, faUmbrellaBeach, faPassport, faWallet } from '@fortawesome/free-solid-svg-icons';

const leadMagnets = [
  {
    id: 'palawan',
    title: '7 Jours a Palawan',
    description: 'El Nido, Coron, plages secretes & budget detaille',
    icon: faUmbrellaBeach,
    file: '/lead-magnets/palawan-7-jours.pdf',
    color: 'accent',
  },
  {
    id: 'visa',
    title: 'Checklist Visa SRRV',
    description: 'Documents, etapes, couts — tout pour votre visa retraite',
    icon: faPassport,
    file: '/lead-magnets/checklist-visa-srrv.pdf',
    color: 'primary',
  },
  {
    id: 'budget',
    title: 'Budget 3 Semaines',
    description: 'Guide complet : vols, hebergement, nourriture, transport',
    icon: faWallet,
    file: '/lead-magnets/budget-3-semaines.pdf',
    color: 'accent',
  },
];

export const LeadMagnetSection = () => {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
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
        setMessage('Telechargement en cours...');
        // Trigger download
        const guide = leadMagnets.find(g => g.id === selectedGuide);
        if (guide) {
          const link = document.createElement('a');
          link.href = guide.file;
          link.download = guide.file.split('/').pop() || 'guide.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setTimeout(() => {
          setMessage('Guide telecharge ! Verifiez aussi votre boite mail.');
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

  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <FontAwesomeIcon icon={faFileDownload} className="text-accent mr-3" />
            Guides <span className="text-primary">Gratuits</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Preparez votre voyage avec nos guides pratiques. Telechargez-les gratuitement en 2 clics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {leadMagnets.map((guide) => (
            <button
              key={guide.id}
              onClick={() => { setSelectedGuide(guide.id); setStatus('idle'); setMessage(''); }}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedGuide === guide.id
                  ? `border-${guide.color} bg-${guide.color}/10 shadow-lg scale-[1.02]`
                  : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
              }`}
            >
              <FontAwesomeIcon
                icon={guide.icon}
                className={`text-3xl mb-3 ${selectedGuide === guide.id ? `text-${guide.color}` : 'text-muted-foreground'}`}
              />
              <h3 className="font-bold text-lg mb-2">{guide.title}</h3>
              <p className="text-sm text-muted-foreground">{guide.description}</p>
            </button>
          ))}
        </div>

        {selectedGuide && (
          <div className="max-w-md mx-auto">
            {status === 'success' ? (
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <FontAwesomeIcon icon={faCheck} className="text-3xl text-green-500 mb-3" />
                <p className="font-semibold text-green-700">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email pour recevoir le guide"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                    disabled={status === 'loading'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50 whitespace-nowrap"
                >
                  {status === 'loading' ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faFileDownload} className="mr-2" />
                  )}
                  Telecharger
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-red-500 text-sm text-center mt-3">{message}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
