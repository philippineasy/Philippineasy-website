'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { trackCtaClicked } from '@/lib/analytics'
import type { KlookActivity } from './klook-activities-data'

// Friendly labels for the "lieu" pill — destination is a tracking slug
// (e.g. "palawan"), not display copy.
const DESTINATION_LABELS: Record<string, string> = {
  palawan: 'Palawan',
  cebu: 'Cebu & Visayas',
  siargao: 'Siargao',
  philippines: 'Philippines',
}

function destinationLabel(destination: string): string {
  return DESTINATION_LABELS[destination] ?? destination
}

const PinIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="flex-shrink-0"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

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
                destination={destination}
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
  destination: string
  isActive: boolean
  onTrack: () => void
}

function ActivityCard({ activity, destination, isActive, onTrack }: ActivityCardProps) {
  return (
    <motion.a
      href={activity.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={onTrack}
      className="group block rounded-2xl overflow-hidden bg-card border-[0.5px] border-border shadow-card-rest hover:shadow-card transition-shadow duration-300"
      animate={{
        scale: isActive ? 1 : 0.75,
        opacity: isActive ? 1 : 0.35,
        filter: isActive ? 'blur(0px)' : 'blur(1px)',
      }}
      whileHover={{ y: -4 }}
      transition={{
        scale: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        opacity: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        filter: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        y: { duration: 0.2, ease: 'easeOut' },
      }}
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      {/* Image */}
      <div className="relative w-full h-[180px] overflow-hidden bg-muted">
        <Image
          src={activity.image}
          alt={activity.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 60vw, (max-width: 1024px) 48vw, 40vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          priority={isActive}
        />

        {/* Price pill bottom-right — text-accent-strong for AA contrast on bg-card (white) */}
        <span className="absolute bottom-3 right-3 inline-flex items-center px-3 py-1.5 rounded bg-card text-accent-strong text-[13px] font-bold shadow-md">
          dès&nbsp;{activity.priceFrom}&nbsp;€
        </span>
      </div>

      {/* Body */}
      <div className="px-5 pt-[18px] pb-5">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground uppercase font-medium mb-2 tracking-[0.04em]">
          <PinIcon />
          {destinationLabel(destination)}
        </div>
        <h4
          className="text-[16px] font-semibold text-foreground mb-2.5 leading-[1.35] line-clamp-2"
          style={{ letterSpacing: '-0.01em' }}
        >
          {activity.title}
        </h4>
        <div className="flex items-baseline gap-2 mb-4">
          <span
            className="text-accent-strong font-bold text-[14px]"
            aria-label={`Note ${activity.rating} sur 5`}
          >
            ★ {activity.rating}
          </span>
          <span className="text-[12px] text-muted-foreground">({activity.reviews})</span>
        </div>

        {/* CTA — outline, full width; whole card is already the clickable link */}
        <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-lg font-semibold text-sm transition-colors duration-200 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
          Réserver
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </motion.a>
  )
}
