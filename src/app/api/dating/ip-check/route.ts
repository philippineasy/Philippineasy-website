import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { ip, user_id } = await request.json();

  if (!ip) {
    return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`);
    if (!response.ok) {
      throw new Error('Failed to fetch IP info');
    }
    const data = await response.json();

    // Check for VPN, proxy, or hosting provider
    const isSuspicious = data.vpn || data.proxy || data.hosting;

    if (isSuspicious) {
      // Log the attempt
      await supabase.from('users_restricted').insert({
        user_id: user_id || null,
        ip_address: ip,
        reason: `Suspicious IP detected: ${JSON.stringify(data)}`,
      });
      return NextResponse.json({ is_vpn: true, error: 'VPN or proxy detected. Please disable it to continue.' }, { status: 403 });
    }

    return NextResponse.json({ is_vpn: false });
  } catch (error: any) {
    console.error('IP check error:', error);
    return NextResponse.json({ error: 'Failed to verify IP address.' }, { status: 500 });
  }
}
