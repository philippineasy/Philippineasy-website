'use client';

import { CheckCircle } from 'lucide-react';

const ComparisonTable = () => {
  return (
    <div className="mt-12">
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
  );
};

export default ComparisonTable;
