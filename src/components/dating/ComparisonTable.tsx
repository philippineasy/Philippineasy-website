'use client';

import { CheckCircle } from 'lucide-react';
import { DATING_CONFIG } from '@/config/dating';

// Chiffres lus depuis DATING_CONFIG (source unique de vérité, alignée sur les
// triggers/fonctions Supabase) — aucune promesse ici qui ne soit pas tenue par le code.
const FREE_MESSAGE_LIMIT = String(DATING_CONFIG.free_plan.daily_message_limit);
const PREMIUM_MESSAGE_LIMIT =
  DATING_CONFIG.premium_plan.daily_message_limit === -1
    ? 'Illimités'
    : String(DATING_CONFIG.premium_plan.daily_message_limit);
const FREE_SUPER_LIKES =
  DATING_CONFIG.free_plan.super_likes_per_day > 0
    ? `${DATING_CONFIG.free_plan.super_likes_per_day} par jour`
    : null;
const PREMIUM_SUPER_LIKES = `${DATING_CONFIG.premium_plan.super_likes_per_day} par jour`;
const FREE_TRANSLATION_LIMIT = `${DATING_CONFIG.free_plan.translation_daily_limit}/jour`;
const PREMIUM_TRANSLATION_LIMIT =
  DATING_CONFIG.premium_plan.translation_daily_limit === -1
    ? 'Illimitée'
    : `${DATING_CONFIG.premium_plan.translation_daily_limit}/jour`;

const ComparisonTable = () => {
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-center text-foreground">Comparez les fonctionnalités</h3>
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fonctionnalité</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Gratuit</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider bg-primary/10 text-primary">Premium</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Inscription & Création de profil</td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-primary/10"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Recherche de profils</td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-primary/10"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Messages par jour (hommes)</td>
                <td className="px-6 py-4 text-center text-sm text-muted-foreground">{FREE_MESSAGE_LIMIT}</td>
                <td className="px-6 py-4 text-center bg-primary/10 text-sm font-semibold text-primary">{PREMIUM_MESSAGE_LIMIT}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Messages (femmes)</td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-primary">Illimités</td>
                <td className="px-6 py-4 text-center bg-primary/10 text-sm font-semibold text-primary">Illimités</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Traduction FR ↔ EN ↔ Tagalog</td>
                <td className="px-6 py-4 text-center text-sm text-muted-foreground">{FREE_TRANSLATION_LIMIT}</td>
                <td className="px-6 py-4 text-center bg-primary/10 text-sm font-semibold text-primary">{PREMIUM_TRANSLATION_LIMIT}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Voir qui a aimé votre profil</td>
                <td className="px-6 py-4 text-center text-xl text-muted-foreground/60">-</td>
                <td className="px-6 py-4 text-center bg-primary/10"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Super Likes</td>
                <td className="px-6 py-4 text-center text-xl text-muted-foreground/60">
                  {FREE_SUPER_LIKES ?? '-'}
                </td>
                <td className="px-6 py-4 text-center bg-primary/10 text-sm font-semibold text-primary">{PREMIUM_SUPER_LIKES}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Visibilité accrue</td>
                <td className="px-6 py-4 text-center text-xl text-muted-foreground/60">-</td>
                <td className="px-6 py-4 text-center bg-primary/10"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Mode Incognito</td>
                <td className="px-6 py-4 text-center text-xl text-muted-foreground/60">-</td>
                <td className="px-6 py-4 text-center bg-primary/10"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
