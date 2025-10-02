/**
 * Google Indexing API - Notification instantanée à Google
 * Permet d'indexer les nouveaux articles en 2-5 minutes
 * Quota : 200 URLs/jour (gratuit)
 * Docs: https://developers.google.com/search/apis/indexing-api/v3/using-api
 */

import { google } from 'googleapis';

interface IndexingResponse {
  success: boolean;
  message: string;
  statusCode?: number;
}

/**
 * Soumet une URL à Google Indexing API pour indexation rapide
 * @param url - URL complète à indexer (ex: https://philippineasy.com/voyager/palawan/el-nido)
 * @returns Promise avec le résultat de la soumission
 */
export async function submitToGoogleIndexing(url: string): Promise<IndexingResponse> {
  try {
    // Vérifier que les credentials existent
    if (!process.env.GOOGLE_INDEXING_CREDENTIALS) {
      console.warn('⚠️ GOOGLE_INDEXING_CREDENTIALS non défini, soumission Google ignorée');
      return {
        success: false,
        message: 'Credentials Google non configurés',
      };
    }

    // Parser les credentials depuis la variable d'environnement
    const credentials = JSON.parse(process.env.GOOGLE_INDEXING_CREDENTIALS);

    // Authentification avec le Service Account
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    // Créer le client Indexing API
    const indexing = google.indexing({ version: 'v3', auth });

    // Soumettre l'URL avec le type URL_UPDATED (nouveau contenu ou mis à jour)
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: 'URL_UPDATED', // URL_UPDATED pour nouveaux articles ou mises à jour
      },
    });

    console.log(`✅ Google Indexing API : ${url} soumis avec succès`);
    console.log('📊 Réponse Google:', response.data);

    return {
      success: true,
      message: 'URL soumise à Google avec succès',
      statusCode: response.status,
    };

  } catch (error: any) {
    // Ne pas bloquer la publication si l'API Google échoue
    console.error('❌ Erreur Google Indexing API:', error.message);

    // Détails de l'erreur pour debug
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }

    return {
      success: false,
      message: error.message || 'Erreur inconnue',
      statusCode: error.response?.status,
    };
  }
}

/**
 * Soumet plusieurs URLs à Google Indexing API (batch)
 * Limite : 100 URLs par batch, 200 URLs/jour au total
 * @param urls - Array d'URLs complètes à indexer
 */
export async function submitBatchToGoogleIndexing(urls: string[]): Promise<IndexingResponse[]> {
  // Limiter à 100 URLs par batch (limite Google)
  const limitedUrls = urls.slice(0, 100);

  console.log(`📤 Soumission de ${limitedUrls.length} URLs à Google Indexing API`);

  // Soumettre chaque URL individuellement (pas de vraie API batch dans v3)
  const results = await Promise.all(
    limitedUrls.map(url => submitToGoogleIndexing(url))
  );

  const successCount = results.filter(r => r.success).length;
  console.log(`✅ ${successCount}/${limitedUrls.length} URLs soumises avec succès à Google`);

  return results;
}

/**
 * Vérifie le statut d'indexation d'une URL sur Google
 * @param url - URL à vérifier
 */
export async function getGoogleIndexingStatus(url: string): Promise<any> {
  try {
    if (!process.env.GOOGLE_INDEXING_CREDENTIALS) {
      throw new Error('GOOGLE_INDEXING_CREDENTIALS non défini');
    }

    const credentials = JSON.parse(process.env.GOOGLE_INDEXING_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing({ version: 'v3', auth });

    // Récupérer les métadonnées de l'URL
    const response = await indexing.urlNotifications.getMetadata({
      url,
    });

    console.log('📊 Statut indexation Google:', response.data);
    return response.data;

  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération du statut:', error.message);
    throw error;
  }
}
