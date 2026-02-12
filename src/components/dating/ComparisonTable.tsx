'use client';

import { CheckCircle } from 'lucide-react';

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
                <td className="px-6 py-4 text-center text-sm text-muted-foreground">2</td>
                <td className="px-6 py-4 text-center bg-primary/10 text-sm font-semibold text-primary">Illimités</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Messages (femmes)</td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-primary">Illimités</td>
                <td className="px-6 py-4 text-center bg-primary/10 text-sm font-semibold text-primary">Illimités</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Voir qui a aimé votre profil</td>
                <td className="px-6 py-4 text-center text-xl text-muted-foreground/60">-</td>
                <td className="px-6 py-4 text-center bg-primary/10"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Super Likes</td>
                <td className="px-6 py-4 text-center text-sm text-muted-foreground">1 par semaine</td>
                <td className="px-6 py-4 text-center bg-primary/10 text-sm font-semibold text-primary">5 par jour</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">Mise en avant du profil</td>
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
