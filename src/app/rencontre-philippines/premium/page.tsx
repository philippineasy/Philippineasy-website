import { CheckCircle, Star, Zap, Heart, Eye, Ghost } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Passez Premium | Avantages exclusifs sur Philippineasy Rencontre Philippines',
  description: 'Découvrez les avantages de l\'abonnement Premium : Super Likes, mode incognito, et voyez qui vous a liké. Multipliez vos chances de rencontre.',
};

const PremiumPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Passez à <span className="text-blue-600">Premium</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Débloquez le meilleur de notre plateforme et multipliez vos chances de faire des rencontres inoubliables.
          </p>
        </div>

        {/* Detailed Features Section */}
        <div className="mt-20">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Les avantages Premium en détail</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Super Likes */}
                <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 text-white mb-6">
                        <Star className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Super Likes</h3>
                    <p className="text-gray-600">
                        Vous avez un vrai coup de cœur ? Montrez-le avec un Super Like. Votre profil apparaîtra en priorité chez cette personne avec une notification spéciale. Vos chances de match sont multipliées par 3 !
                    </p>
                </div>
                {/* See Who Likes You */}
                <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white mb-6">
                        <Heart className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Découvrez qui vous aime</h3>
                    <p className="text-gray-600">
                        Ne perdez plus de temps à swiper dans le vide. Découvrez directement la liste de toutes les personnes qui ont déjà liké votre profil et choisissez qui vous plaît en retour.
                    </p>
                </div>
                {/* Incognito Mode */}
                <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white mb-6">
                        <Ghost className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Mode Incognito</h3>
                    <p className="text-gray-600">
                        Visitez les profils en toute discrétion. Vous n'apparaîtrez dans les suggestions et les recherches que des personnes que vous avez vous-même likées. Contrôlez qui peut voir votre profil.
                    </p>
                </div>
            </div>
        </div>


        {/* Pricing Section */}
        <div className="mt-24 bg-white shadow-xl rounded-lg">
          <div className="pt-12 sm:pt-16 lg:pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Choisissez votre plan
                </h2>
                <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                  Un seul plan, plusieurs durées. Simple et transparent.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pb-12 bg-gray-50 sm:pb-16 lg:pb-20">
            <div className="relative">
              <div className="absolute inset-0 h-1/2 bg-white"></div>
              <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto lg:max-w-5xl lg:grid lg:grid-cols-3 lg:gap-8">
                  {/* Plan 1 */}
                  <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
                    <div className="p-6">
                      <h2 className="text-lg leading-6 font-medium text-gray-900">1 Mois</h2>
                      <p className="mt-4 text-4xl font-extrabold text-gray-900">19.99€</p>
                      <p className="mt-2 text-sm text-gray-500">par mois</p>
                      <Link href="/api/dating/checkout?plan=month" className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700">
                        Choisir ce plan
                      </Link>
                    </div>
                  </div>
                  {/* Plan 2 - Most Popular */}
                  <div className="border-2 border-blue-600 rounded-lg shadow-lg divide-y divide-gray-200 bg-white relative">
                     <div className="absolute top-0 -translate-y-1/2 w-full text-center">
                        <span className="px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">Le plus populaire</span>
                    </div>
                    <div className="p-6">
                      <h2 className="text-lg leading-6 font-medium text-gray-900">6 Mois</h2>
                      <p className="mt-4 text-4xl font-extrabold text-blue-600">9.99€</p>
                      <p className="mt-2 text-sm text-gray-500">par mois (facturé 59.94€)</p>
                      <Link href="/api/dating/checkout?plan=semester" className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700">
                        Choisir ce plan
                      </Link>
                    </div>
                  </div>
                  {/* Plan 3 */}
                  <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
                    <div className="p-6">
                      <h2 className="text-lg leading-6 font-medium text-gray-900">3 Mois</h2>
                      <p className="mt-4 text-4xl font-extrabold text-gray-900">14.99€</p>
                      <p className="mt-2 text-sm text-gray-500">par mois (facturé 44.97€)</p>
                      <Link href="/api/dating/checkout?plan=trimester" className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700">
                        Choisir ce plan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-20">
            <h3 className="text-2xl font-bold text-center text-gray-900">Comparez les fonctionnalités</h3>
            <div className="mt-8 max-w-2xl mx-auto">
                <div className="shadow-lg rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fonctionnalité</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Gratuit</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 text-blue-700">Premium</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Inscription & Création de profil</td>
                                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                                <td className="px-6 py-4 text-center bg-blue-50"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Recherche de profils</td>
                                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                                <td className="px-6 py-4 text-center bg-blue-50"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Messages par jour (hommes)</td>
                                <td className="px-6 py-4 text-center text-sm text-gray-500">2</td>
                                <td className="px-6 py-4 text-center bg-blue-50 text-sm font-semibold text-blue-700">Illimités</td>
                            </tr>
                             <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Messages (femmes)</td>
                                <td className="px-6 py-4 text-center text-sm font-semibold text-blue-700">Illimités</td>
                                <td className="px-6 py-4 text-center bg-blue-50 text-sm font-semibold text-blue-700">Illimités</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Voir qui a aimé votre profil</td>
                                <td className="px-6 py-4 text-center text-xl text-gray-400">-</td>
                                <td className="px-6 py-4 text-center bg-blue-50"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Super Likes</td>
                                <td className="px-6 py-4 text-center text-sm text-gray-500">1 par semaine</td>
                                <td className="px-6 py-4 text-center bg-blue-50 text-sm font-semibold text-blue-700">5 par jour</td>
                            </tr>
                             <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mise en avant du profil</td>
                                <td className="px-6 py-4 text-center text-xl text-gray-400">-</td>
                                <td className="px-6 py-4 text-center bg-blue-50"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                            </tr>
                             <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mode Incognito</td>
                                <td className="px-6 py-4 text-center text-xl text-gray-400">-</td>
                                <td className="px-6 py-4 text-center bg-blue-50"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900">Questions Fréquentes</h3>
          <div className="mt-6 space-y-4">
            <div className="border-t border-gray-200 pt-4">
              <dt className="font-medium text-gray-900">Le paiement est-il sécurisé ?</dt>
              <dd className="mt-2 text-sm text-gray-500">Oui, toutes les transactions sont traitées via Stripe, une plateforme de paiement mondialement reconnue pour sa sécurité.</dd>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <dt className="font-medium text-gray-900">Puis-je annuler mon abonnement à tout moment ?</dt>
              <dd className="mt-2 text-sm text-gray-500">Absolument. Vous pouvez gérer votre abonnement et l'annuler à tout moment depuis les paramètres de votre profil. L'accès Premium restera actif jusqu'à la fin de la période de facturation en cours.</dd>
            </div>
             <div className="border-t border-gray-200 pt-4">
              <dt className="font-medium text-gray-900">Quels sont les moyens de paiement acceptés ?</dt>
              <dd className="mt-2 text-sm text-gray-500">Nous acceptons les principales cartes de crédit (Visa, Mastercard, American Express) ainsi que d'autres moyens de paiement via Stripe.</dd>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PremiumPage;
