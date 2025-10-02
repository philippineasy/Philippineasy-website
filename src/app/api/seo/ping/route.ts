import { NextResponse } from 'next/server';

/**
 * IndexNow API - Notification instantanée aux moteurs de recherche
 * Supporté par: Bing, Yandex, Seznam, Naver
 * Docs: https://www.indexnow.org/
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, urls } = body;

    const indexNowKey = process.env.INDEXNOW_KEY || 'votre-cle-unique-indexnow';
    const host = 'philippineasy.com';

    const urlList = urls || (url ? [url] : [`https://${host}/sitemap.xml`]);

    const indexNowUrl = 'https://api.indexnow.org/indexnow';

    const indexNowResponse = await fetch(indexNowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host,
        key: indexNowKey,
        keyLocation: `https://${host}/${indexNowKey}.txt`,
        urlList,
      }),
    });

    const results = {
      indexNow: {
        status: indexNowResponse.status,
        success: indexNowResponse.ok,
        message: indexNowResponse.ok
          ? 'URLs soumises avec succès à IndexNow (Bing, Yandex)'
          : 'Erreur lors de la soumission à IndexNow',
      },
      submitted: urlList.length,
      urls: urlList,
    };

    if (indexNowResponse.ok) {
      console.log('✅ IndexNow submission successful:', urlList);
      return NextResponse.json({
        success: true,
        message: `${urlList.length} URL(s) soumise(s) pour indexation rapide`,
        ...results
      }, { status: 200 });
    } else {
      console.error('❌ IndexNow submission failed:', indexNowResponse.status);
      return NextResponse.json({
        success: false,
        message: 'Erreur lors de la soumission',
        ...results
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error in ping API:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur lors de la soumission',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
