"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleVendorApplication } from './actions';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface VendorApplicationClientPageProps {
  user: User | null;
  applicationSuccess?: boolean;
}

export default function VendorApplicationClientPage({ user, applicationSuccess = false }: VendorApplicationClientPageProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    vendorName: '',
    vendorDescription: '',
    terms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('vendorName', formData.vendorName);
    data.append('vendorDescription', formData.vendorDescription);
    data.append('terms', formData.terms.toString());
    
    const result = await handleVendorApplication(data);
    if (result && result.success) {
      router.push('/marketplace-aux-philippines/devenir-vendeur?success=true');
    } else if (result && result.message) {
      setError(result.message);
    } else {
      setError('Une erreur inattendue est survenue.');
    }
  };

  const totalSteps = user ? 2 : 3;
  const stepLabels = user ? ['Boutique', 'Confirmation'] : ['Compte', 'Boutique', 'Confirmation'];
  const inputClass =
    'w-full px-4 py-2.5 border border-border bg-card text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent';

  if (applicationSuccess) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border-[0.5px] border-border bg-card p-8 text-center shadow-card-rest md:p-10">
        <span className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckIcon />
        </span>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Candidature envoyée !</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Merci de vouloir rejoindre Philippin&apos;Easy. Votre candidature a bien été enregistrée
          et sera examinée par notre équipe. Vous recevrez un e-mail dès qu&apos;elle sera validée.
          Pensez à confirmer votre adresse e-mail si vous venez de créer votre compte.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/marketplace-aux-philippines"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Découvrir la marketplace
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/profil/boutique"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Mon espace vendeur
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Devenez Partenaire de Philippin'Easy</h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
        Rejoignez notre marketplace-aux-philippines et proposez vos produits ou services à une communauté de voyageurs et d'expatriés passionnés par les Philippines.
      </p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex-1 text-center">
              <div className={`text-sm font-semibold transition-colors ${step > i ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <div className="relative pt-1">
          <div className="h-2 overflow-hidden rounded-full bg-primary/15">
            <div
              style={{ width: `${(step / totalSteps) * 100}%` }}
              className="h-full rounded-full bg-primary transition-all duration-500"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-6 md:p-8 rounded-2xl border-[0.5px] border-border shadow-card-rest space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/40 text-destructive p-4 rounded-lg text-sm">
            <p>{error}</p>
          </div>
        )}
        {step === 1 && !user && (
          <>
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-4 mb-6">Étape 1 : Informations du compte</h2>
            <div>
              <label htmlFor="email" className="block text-foreground mb-2 font-medium">Adresse e-mail</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} placeholder="vous@exemple.com" required autoComplete="email" />
            </div>
            <div>
              <label htmlFor="password" className="block text-foreground mb-2 font-medium">Mot de passe</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} className={inputClass} placeholder="Créez un mot de passe sécurisé" required autoComplete="new-password" />
              <p className="text-sm text-muted-foreground mt-2">Le mot de passe doit contenir au moins 6 caractères.</p>
            </div>
          </>
        )}

        {step === (user ? 1 : 2) && (
          <>
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-4 mb-6">Étape {user ? 1 : 2} : Informations sur votre boutique</h2>
            <div>
              <label htmlFor="vendorName" className="block text-foreground mb-2 font-medium">Nom de votre boutique ou entreprise</label>
              <input type="text" id="vendorName" name="vendorName" value={formData.vendorName} onChange={handleInputChange} className={inputClass} placeholder="Ex : Artisanat de Cebu" required />
            </div>
            <div>
              <label htmlFor="vendorDescription" className="block text-foreground mb-2 font-medium">Décrivez votre activité en quelques mots</label>
              <textarea id="vendorDescription" name="vendorDescription" value={formData.vendorDescription} onChange={handleInputChange} rows={4} className={`${inputClass} resize-y`} placeholder="Nous proposons des objets d'artisanat local faits à la main..." required></textarea>
            </div>
          </>
        )}

        {step === (user ? 2 : 3) && (
          <>
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-4 mb-6">Étape {user ? 2 : 3} : Confirmation</h2>
            <dl className="space-y-3 rounded-xl bg-muted p-4 text-sm">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <dt className="font-medium text-muted-foreground sm:w-40 sm:flex-shrink-0">E-mail</dt>
                <dd className="text-foreground break-words">{formData.email}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <dt className="font-medium text-muted-foreground sm:w-40 sm:flex-shrink-0">Nom de la boutique</dt>
                <dd className="text-foreground break-words">{formData.vendorName}</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <dt className="font-medium text-muted-foreground sm:w-40 sm:flex-shrink-0">Description</dt>
                <dd className="text-foreground break-words">{formData.vendorDescription}</dd>
              </div>
            </dl>
            <div className="flex items-start pt-2">
              <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleInputChange} required className="h-4 w-4 mt-0.5 accent-primary rounded border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <label htmlFor="terms" className="ml-2.5 block text-sm text-foreground">
                Je confirme avoir lu et accepté les <Link href="/conditions-partenaires" className="text-primary hover:underline">conditions de partenariat</Link> de la marketplace.
              </label>
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-3 pt-6">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="inline-flex h-11 items-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Précédent
            </button>
          )}
          {step < totalSteps ? (
            <button type="button" onClick={nextStep} className="ml-auto inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Suivant
              <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button type="submit" className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-accent px-5 font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" disabled={!formData.terms}>
              {user ? 'Envoyer ma candidature' : 'Créer mon compte et envoyer ma candidature'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const CheckIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
