'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLifeRing, faMapMarkerAlt, faPaperPlane, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faYoutube, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

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
        setNewsletterMessage(data.message);
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMessage('Erreur de connexion.');
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">
              Philippin'<span className="text-yellow-500">Easy</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Votre guide complet pour vivre et voyager aux Philippines. Une communauté passionnée prête à vous accompagner.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1RfoyAcYFU/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="https://www.instagram.com/philippineseasy?igsh=MWYwNDg2eThiemdleg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faInstagram} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="/vivre-aux-philippines" className="text-gray-400 hover:text-white transition duration-300">Y Vivre</Link></li>
              <li><Link href="/voyager-aux-philippines" className="text-gray-400 hover:text-white transition duration-300">Voyager</Link></li>
              <li><Link href="/rencontre-philippines" className="text-gray-400 hover:text-white transition duration-300">Rencontres</Link></li>
              <li><Link href="/marketplace-aux-philippines" className="text-gray-400 hover:text-white transition duration-300">Marketplace</Link></li>
              <li><Link href="/forum-sur-les-philippines" className="text-gray-400 hover:text-white transition duration-300">Forums</Link></li>
              <li><Link href="/actualites-sur-les-philippines" className="text-gray-400 hover:text-white transition duration-300">Actualités</Link></li>
              <li><Link href="/meilleurs-plans-aux-philippines" className="text-gray-400 hover:text-white transition duration-300">Meilleurs Plans</Link></li>
              <li><Link href="/application-mobile" className="text-gray-400 hover:text-white transition duration-300">App Mobile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact & Support</h4>
            <ul className="space-y-3">
              <li className="flex items-start"><FontAwesomeIcon icon={faEnvelope} className="text-yellow-500 mt-1 mr-2" /><span className="text-gray-400">philippineasy@gmail.com</span></li>
              <li className="flex items-start"><FontAwesomeIcon icon={faLifeRing} className="text-yellow-500 mt-1 mr-2" /><span className="text-gray-400">Support Membres</span></li>
              <li className="flex items-start"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-yellow-500 mt-1 mr-2" /><span className="text-gray-400">Tandag, Philippines (Bureau Virtuel)</span></li>
            </ul>
            <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Nous suivre</h4>
            <div className="flex space-x-4">
              <a href="https://t.me/philippineasy" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faTelegram} className="text-lg mr-2" /><span>Telegram</span></a>
              <a href="https://wa.me/639561900614?text=Hi%2C%20thanks%20for%20reaching%20out%20to%20Philippin'easy!%20We'll%20reply%20shortly." target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faWhatsapp} className="text-lg mr-2" /><span>WhatsApp</span></a>
            </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">Conseils exclusifs et actus livrés dans votre boîte mail.</p>
            <form className="mb-4" onSubmit={handleNewsletterSubmit}>
              <div className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => { setNewsletterEmail(e.target.value); if (newsletterStatus !== 'idle') setNewsletterStatus('idle'); }}
                  className="px-4 py-2 w-full bg-gray-800 text-white rounded-l-lg focus:outline-none placeholder-gray-500"
                  placeholder="Votre email"
                  required
                  disabled={newsletterStatus === 'loading'}
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                  disabled={newsletterStatus === 'loading'}
                >
                  <FontAwesomeIcon icon={newsletterStatus === 'loading' ? faSpinner : newsletterStatus === 'success' ? faCheck : faPaperPlane} spin={newsletterStatus === 'loading'} />
                </button>
              </div>
            </form>
            {newsletterMessage && (
              <p className={`text-sm mb-2 ${newsletterStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {newsletterMessage}
              </p>
            )}
            <p className="text-gray-500 text-sm">En vous inscrivant, vous acceptez notre politique de confidentialité.</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>© 2026 Philippin'Easy. Tous droits réservés.</p>
          <div className="flex justify-center space-x-6 mt-4 flex-wrap">
            <Link href="/mentions-legales" className="hover:text-white transition duration-300">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white transition duration-300">Confidentialité</Link>
            <Link href="/cgu" className="hover:text-white transition duration-300">CGU</Link>
            <button onClick={() => (window as any).openCookieSettings?.()} className="hover:text-white transition duration-300">Gestion des cookies</button>
            {profile && (profile.role === 'super_admin' || profile.role === 'editor') && (
              <Link href="/admin" className="hover:text-white transition duration-300">Admin</Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
