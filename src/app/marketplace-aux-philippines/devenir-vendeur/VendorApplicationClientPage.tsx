"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleVendorApplication } from './actions';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface VendorApplicationClientPageProps {
  user: User | null;
}

export default function VendorApplicationClientPage({ user }: VendorApplicationClientPageProps) {
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Devenez Partenaire de Philippin'Easy</h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
        Rejoignez notre marketplace-aux-philippines et proposez vos produits ou services à une communauté de voyageurs et d'expatriés passionnés par les Philippines.
      </p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`w-1/${totalSteps} text-center`}>
              <div className={`text-sm font-semibold ${step > i ? 'text-primary' : 'text-muted-foreground'}`}>
                {i === 0 && 'Compte'}
                {i === 1 && 'Boutique'}
                {i === 2 && 'Confirmation'}
              </div>
            </div>
          ))}
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
            <div style={{ width: `${(step / totalSteps) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg shadow-lg space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}
        {step === 1 && !user && (
          <>
            <h2 className="text-2xl font-semibold border-b pb-4 mb-6">Étape 1: Informations du compte</h2>
            <div>
              <label htmlFor="email" className="block text-foreground mb-2 font-semibold">Adresse e-mail</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="vous@exemple.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-foreground mb-2 font-semibold">Mot de passe</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Créez un mot de passe sécurisé" required />
              <p className="text-sm text-muted-foreground mt-2">Le mot de passe doit contenir au moins 6 caractères.</p>
            </div>
          </>
        )}

        {step === (user ? 1 : 2) && (
          <>
            <h2 className="text-2xl font-semibold border-b pb-4 mb-6">Étape {user ? 1 : 2}: Informations sur votre boutique</h2>
            <div>
              <label htmlFor="vendorName" className="block text-foreground mb-2 font-semibold">Nom de votre boutique ou entreprise</label>
              <input type="text" id="vendorName" name="vendorName" value={formData.vendorName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Ex: Artisanat de Cebu" required />
            </div>
            <div>
              <label htmlFor="vendorDescription" className="block text-foreground mb-2 font-semibold">Décrivez votre activité en quelques mots</label>
              <textarea id="vendorDescription" name="vendorDescription" value={formData.vendorDescription} onChange={handleInputChange} rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Nous proposons des objets d'artisanat local faits à la main..." required></textarea>
            </div>
          </>
        )}

        {step === (user ? 2 : 3) && (
          <>
            <h2 className="text-2xl font-semibold border-b pb-4 mb-6">Étape {user ? 2 : 3}: Confirmation</h2>
            <div className="space-y-4">
              <div><span className="font-semibold">Email:</span> {formData.email}</div>
              <div><span className="font-semibold">Nom de la boutique:</span> {formData.vendorName}</div>
              <div><span className="font-semibold">Description:</span> {formData.vendorDescription}</div>
            </div>
            <div className="flex items-start pt-4">
              <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleInputChange} required className="h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 block text-sm text-foreground">
                Je confirme avoir lu et accepté les <Link href="/conditions-partenaires" className="text-primary hover:underline">conditions de partenariat</Link> de la marketplace.
              </label>
            </div>
          </>
        )}

        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition duration-300 font-semibold">
              Précédent
            </button>
          )}
          {step < totalSteps ? (
            <button type="button" onClick={nextStep} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold ml-auto">
              Suivant
            </button>
          ) : (
            <button type="submit" className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold disabled:opacity-50" disabled={!formData.terms}>
              {user ? 'Envoyer ma candidature' : 'Créer mon compte et envoyer ma candidature'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
