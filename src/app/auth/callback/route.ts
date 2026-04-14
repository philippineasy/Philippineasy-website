import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { sendWelcomeEmail } from '@/emails/senders/welcome'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      // Send welcome email for new users (created within last 2 minutes)
      const createdAt = new Date(data.user.created_at);
      const isNewUser = Date.now() - createdAt.getTime() < 2 * 60 * 1000;

      if (isNewUser && data.user.email) {
        const userName = data.user.user_metadata?.username || data.user.email.split('@')[0];
        sendWelcomeEmail(data.user.id, data.user.email, userName).catch((err) => {
          console.error('Welcome email error:', err);
        });
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
