import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const sitemapUrl = 'https://philippineasy.com/sitemap.xml';
    const googlePingUrl = `http://www.google.com/ping?sitemap=${sitemapUrl}`;

    const res = await fetch(googlePingUrl);

    if (res.ok) {
      console.log('Sitemap pinged successfully.');
      return NextResponse.json({ message: 'Sitemap pinged successfully.' }, { status: 200 });
    } else {
      console.error('Failed to ping sitemap.');
      return NextResponse.json({ message: 'Failed to ping sitemap.' }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}
