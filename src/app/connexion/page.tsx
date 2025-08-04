'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faMapSigns, faComments, faStar } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const ConnexionPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
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

    const action = isLogin ? supabase.auth.signInWithPassword({ email, password }) : supabase.auth.signUp({ email, password, options: { data: { username } } });

    const { error } = await action;

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isLogin ? 'Connexion réussie !' : 'Inscription réussie ! Veuillez vérifier vos e-mails.');
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <main className="py-16 md:py-24 bg-black/50 flex items-center justify-center min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Form Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="mb-8 text-center">
                <button onClick={() => setIsLogin(true)} className={`px-6 py-2 font-semibold text-lg focus:outline-none ${isLogin ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                  Connexion
                </button>
                <button onClick={() => setIsLogin(false)} className={`px-6 py-2 font-semibold text-lg focus:outline-none ${!isLogin ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                  Inscription
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                  {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
                </h2>
                {!isLogin && (
                  <div>
                    <label className="block text-foreground mb-2" htmlFor="username">Nom d'utilisateur</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Pseudo" required />
                  </div>
                )}
                <div>
                  <label className="block text-foreground mb-2" htmlFor="email">Email</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="votre@email.com" required />
                </div>
                <div>
                  <label className="block text-foreground mb-2" htmlFor="password">Mot de passe</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" required />
                </div>
                {isLogin && (
                    <div className="flex items-center justify-between">
                        <label htmlFor="remember" className="flex items-center text-sm text-muted-foreground"><input type="checkbox" id="remember" className="mr-2 text-primary focus:ring-ring"/>Se souvenir de moi</label>
                        <a href="#" className="text-sm text-primary hover:underline">Mot de passe oublié ?</a>
                    </div>
                )}
                <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold disabled:opacity-50">
                  {loading ? 'Chargement...' : (isLogin ? 'Connexion' : 'Créer mon compte')}
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
                <button onClick={() => handleOAuthLogin('facebook')} disabled={loading} className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition duration-300 text-foreground font-medium">
                  <FontAwesomeIcon icon={faFacebookF} className="text-primary mr-2" /> Continuer avec Facebook
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-border text-center">
                <h3 className="text-lg font-semibold text-foreground">Vous êtes un professionnel ?</h3>
                <p className="text-muted-foreground mt-2 mb-4 text-sm">
                  Mettez en avant votre savoir-faire, vos produits ou vos services auprès de notre communauté de passionnés.
                </p>
                <Link 
                  href="/marketplace/vendeur/connexion" 
                  className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition duration-300 font-semibold"
                >
                  Devenir Partenaire
                </Link>
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 relative">
              <Image src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max" alt="Paysage" fill className="object-cover" />
              <div className="relative p-10 md:p-12 bg-gradient-to-b from-primary/80 via-primary/90 to-primary h-full flex flex-col justify-center text-primary-foreground">
                <h3 className="text-4xl font-bold mb-6 text-accent/90">Devenez Membre</h3>
                <p className="mb-8 text-lg">Accédez à des fonctionnalités exclusives et rejoignez une communauté passionnée.</p>
                <ul className="space-y-5">
                  <li className="flex items-center text-lg"><FontAwesomeIcon icon={faComments} className="text-accent/90 w-6 mr-4" /><span>Participez aux forums privés.</span></li>
                  <li className="flex items-center text-lg"><FontAwesomeIcon icon={faMapSigns} className="text-accent/90 w-6 mr-4" /><span>Enregistrez vos itinéraires.</span></li>
                  <li className="flex items-center text-lg"><FontAwesomeIcon icon={faStar} className="text-accent/90 w-6 mr-4" /><span>Recevez des recommandations.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConnexionPage;
