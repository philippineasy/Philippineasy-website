'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faStar,
  faClock,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons'
import { trackCtaClicked } from '@/lib/analytics'
import type { KlookActivity } from './klook-activities-data'

interface KlookCarouselProps {
  activities: KlookActivity[]
  destination: string
  title?: string
  subtitle?: string
}

export function KlookCarousel({
  activities,
  destination,
  title = 'Activites a ne pas manquer',
  subtitle = 'Reservez les meilleures experiences aux meilleurs prix',
}: KlookCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  const handleActivityClick = (activity: KlookActivity) => {
    trackCtaClicked({
      cta_text: `klook_${activity.id}`,
      cta_location: `klook_carousel_${destination}`,
      destination_url: activity.url,
    })
  }

  return (
    <section className="my-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            <span className="inline-block w-8 h-px bg-primary" />
            En partenariat avec Klook
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h3>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>

        {/* Desktop nav arrows */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={scrollPrev}
            aria-label="Activite precedente"
            className="w-11 h-11 rounded-full border border-border bg-card hover:bg-muted transition-colors flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Activite suivante"
            className="w-11 h-11 rounded-full border border-border bg-card hover:bg-muted transition-colors flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* Embla viewport */}
      <div className="overflow-hidden -mx-4 md:mx-0" ref={emblaRef}>
        <div className="flex">
          {activities.map((activity, idx) => (
            <div
              key={activity.id}
              className="flex-[0_0_90%] sm:flex-[0_0_60%] md:flex-[0_0_48%] lg:flex-[0_0_40%] min-w-0 px-2"
            >
              <ActivityCard
                activity={activity}
                isActive={idx === selectedIndex}
                onTrack={() => handleActivityClick(activity)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Aller a l'activite ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === selectedIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        Liens d&apos;affiliation — aucun cout supplementaire pour vous.{' '}
        <Link href="/partenaires" className="underline hover:text-foreground">
          En savoir plus
        </Link>
      </p>
    </section>
  )
}

// ── Card component ──────────────────────────────────────────

interface ActivityCardProps {
  activity: KlookActivity
  isActive: boolean
  onTrack: () => void
}

function ActivityCard({ activity, isActive, onTrack }: ActivityCardProps) {
  return (
    <motion.a
      href={activity.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={onTrack}
      className="group block rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl transition-shadow duration-300"
      animate={{
        scale: isActive ? 1 : 0.75,
        opacity: isActive ? 1 : 0.35,
        filter: isActive ? 'blur(0px)' : 'blur(1px)',
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      {/* Image with overlay */}
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <Image
          src={activity.image}
          alt={activity.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 60vw, (max-width: 1024px) 48vw, 40vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={isActive}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <span className="text-[10px] text-muted-foreground">Des</span>{' '}
          <span className="text-sm font-bold text-foreground">{activity.priceFrom}€</span>
        </div>

        {/* Duration badge */}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-[10px] font-medium flex items-center gap-1">
          <FontAwesomeIcon icon={faClock} className="text-[9px]" />
          {activity.duration}
        </div>

        {/* Title & subtitle over image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h4 className="text-base md:text-lg font-bold leading-tight mb-0.5 line-clamp-2">
            {activity.title}
          </h4>
          <p className="text-xs text-white/90 line-clamp-1">{activity.subtitle}</p>
        </div>
      </div>

      {/* Content below image */}
      <div className="p-4 space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-amber-500">
            <FontAwesomeIcon icon={faStar} className="text-[11px]" />
            <span className="font-semibold text-foreground">{activity.rating}</span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{activity.reviews}</span>
        </div>

        {/* Highlights — show 2 for compactness */}
        <ul className="space-y-1">
          {activity.highlights.slice(0, 2).map((h) => (
            <li key={h} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1 inline-block w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              <span className="line-clamp-1">{h}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
            Reserver sur Klook
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
          </span>
          <AnimatePresence>
            {isActive && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-green-700 dark:text-green-400 font-medium"
              >
                Annulation gratuite
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.a>
  )
}
