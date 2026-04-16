'use client'

import { trackCtaClicked } from '@/lib/analytics'

interface AffiliateLinkProps {
  href: string
  partner: string
  children: React.ReactNode
  className?: string
  location?: string
}

export function AffiliateLink({ href, partner, children, className, location = 'inline' }: AffiliateLinkProps) {
  const handleClick = () => {
    trackCtaClicked({
      cta_text: `affiliate_${partner}`,
      cta_location: location,
      destination_url: href,
    })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}
