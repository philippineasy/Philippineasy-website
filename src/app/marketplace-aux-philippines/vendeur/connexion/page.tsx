'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';

const VendeurConnexionPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Connexion réussie !');
        router.push('/profil/boutique');
        router.refresh();
      }
    } else {
      router.push('/marketplace-aux-philippines/devenir-vendeur');
    }
    setLoading(false);
  };

  return (
    <main className="py-16 md:py-24 bg-muted flex items-center justify-center min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-card rounded-2xl border-[0.5px] border-border shadow-card overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Form Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="mb-8 text-center">
                <button onClick={() => setIsLogin(true)} className={`px-6 py-2 font-semibold text-lg focus:outline-none ${isLogin ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                  Connexion Vendeur
                </button>
                <button onClick={() => setIsLogin(false)} className={`px-6 py-2 font-semibold text-lg focus:outline-none ${!isLogin ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                  Devenir Partenaire
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                  {isLogin ? 'Connectez-vous à votre espace vendeur' : 'Rejoignez notre marketplace-aux-philippines'}
                </h2>
                
                {isLogin ? (
                  <>
                    <div>
                      <label className="block text-foreground mb-2 font-medium" htmlFor="email">Email</label>
                      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-border bg-card text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" placeholder="votre@email.com" required autoComplete="email" />
                    </div>
                    <div>
                      <label className="block text-foreground mb-2 font-medium" htmlFor="password">Mot de passe</label>
                      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-border bg-card text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" placeholder="••••••••" required autoComplete="current-password" />
                    </div>
                     <div className="flex items-center justify-end">
                        <Link href="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">Mot de passe oublié ?</Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">Créez votre compte et commencez à vendre sur Philippin'Easy.</p>
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold disabled:opacity-50">
                  {loading ? 'Chargement...' : (isLogin ? 'Connexion' : 'Créer mon compte vendeur')}
                </button>
              </form>

              <div className="my-6 flex items-center">
                <hr className="flex-grow border-t border-border" />
                <span className="px-3 text-muted-foreground text-sm">OU</span>
                <hr className="flex-grow border-t border-border" />
              </div>

              <div className="flex flex-col space-y-3">
                <button onClick={() => handleOAuthLogin('google')} disabled={loading} className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition duration-300 text-foreground font-medium">
                  <FontAwesomeIcon icon={faGoogle} className="text-destructive mr-2" /> Continuer avec Google
                </button>
                {/* TODO: Réactiver quand l'app Facebook sera publiée (vérification d'entreprise requise)
                <button onClick={() => handleOAuthLogin('facebook')} disabled={loading} className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition duration-300 text-foreground font-medium">
                  <FontAwesomeIcon icon={faFacebookF} className="text-primary mr-2" /> Continuer avec Facebook
                </button>
                */}
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 relative">
              <Image src="/images/budget/marche-fruits-locaux.webp" alt="Marché local aux Philippines" fill className="object-cover" />
              <div className="relative p-10 md:p-12 bg-gradient-to-b from-primary/80 via-primary/90 to-primary h-full flex flex-col justify-center text-primary-foreground">
                <h3 className="text-4xl font-bold mb-6 text-accent/90">Vendez sur Philippin'Easy</h3>
                <p className="mb-8 text-lg">Rejoignez une communauté de vendeurs passionnés et développez votre activité.</p>
                <ul className="space-y-5">
                  <li className="flex items-center text-lg"><span>Atteignez une audience ciblée.</span></li>
                  <li className="flex items-center text-lg"><span>Profitez d'outils de gestion simples.</span></li>
                  <li className="flex items-center text-lg"><span>Bénéficiez de notre support dédié.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VendeurConnexionPage;
