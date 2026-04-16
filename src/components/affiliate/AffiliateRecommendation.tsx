'use client'

import Link from 'next/link'
import { AffiliateLink } from './AffiliateLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faStar } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface AffiliateItem {
  name: string
  description: string
  advantage: string
  url: string
  recommended?: boolean
}

interface AffiliateRecommendationProps {
  title: string
  icon: IconDefinition
  items: AffiliateItem[]
  location: string
}

export function AffiliateRecommendation({ title, icon, items, location }: AffiliateRecommendationProps) {
  return (
    <section className="my-12 rounded-2xl border bg-gradient-to-br from-card to-muted/30 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="text-primary" />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.name} className="relative rounded-xl border bg-card p-5">
            {item.recommended && (
              <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                <FontAwesomeIcon icon={faStar} className="text-[9px]" />
                Recommande
              </span>
            )}
            <h4 className="font-semibold mb-1">{item.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
            <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-3">
              {item.advantage}
            </p>
            <AffiliateLink
              href={item.url}
              partner={item.name.toLowerCase().replace(/\s/g, '-')}
              location={location}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Decouvrir
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
            </AffiliateLink>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Liens d&apos;affiliation — aucun cout supplementaire pour vous.{' '}
        <Link href="/partenaires" className="underline hover:text-foreground">En savoir plus</Link>
      </p>
    </section>
  )
}
