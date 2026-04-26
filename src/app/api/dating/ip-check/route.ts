import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// IPv4 + IPv6 simple validation (suffisant pour empêcher SSRF / path injection)
const IPV4 = /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/;
const IPV6 = /^[0-9a-fA-F:]+$/;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { ip } = await request.json();

  if (!ip || typeof ip !== 'string') {
    return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
  }
  if (!IPV4.test(ip) && !IPV6.test(ip)) {
    return NextResponse.json({ error: 'Invalid IP address format' }, { status: 400 });
  }

  // user_id ne vient JAMAIS du body — un attaquant pourrait sinon faire bannir
  // un autre utilisateur. On le récupère depuis la session.
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  try {
    const response = await fetch(`https://ipinfo.io/${encodeURIComponent(ip)}?token=${process.env.IPINFO_TOKEN}`);
    if (!response.ok) {
      throw new Error('Failed to fetch IP info');
    }
    const data = await response.json();

    const isSuspicious = data.vpn || data.proxy || data.hosting;

    if (isSuspicious) {
      await supabase.from('users_restricted').insert({
        user_id: userId,
        ip_address: ip,
        reason: `Suspicious IP detected: ${JSON.stringify(data)}`,
      });
      return NextResponse.json({ is_vpn: true, error: 'VPN or proxy detected. Please disable it to continue.' }, { status: 403 });
    }

    return NextResponse.json({ is_vpn: false });
  } catch (error) {
    console.error('IP check error:', error);
    return NextResponse.json({ error: 'Failed to verify IP address.' }, { status: 500 });
  }
}
