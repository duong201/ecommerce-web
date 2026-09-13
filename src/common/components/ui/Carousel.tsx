import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'
import IconButton from './IconButton'
import './Carousel.scss'

interface CarouselProps {
  children: React.ReactNode
  /** `hero` shows one full-width slide; `rail` shows a scrolling row of cards. */
  variant?: 'hero' | 'rail'
  /** Auto-advance interval in ms. 0 disables it; paused on hover and focus. */
  autoPlay?: number
  /** Wraps past the ends so neither arrow sits disabled. */
  loop?: boolean
  showDots?: boolean
  ariaLabel?: string
  className?: string
}

/**
 * Scroll-snap carousel.
 *
 * This replaced react-slick, which shipped two global stylesheets that fought
 * the design tokens and could not be themed. Native scroll snapping gives the
 * same behaviour with real touch/trackpad momentum, works without JavaScript,
 * and respects `prefers-reduced-motion` for free.
 */
const Carousel = ({
  children,
  variant = 'rail',
  autoPlay = 0,
  loop = false,
  showDots = false,
  ariaLabel,
  className,
}: CarouselProps) => {
  const { t } = useTranslation()
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [paused, setPaused] = useState(false)

  const slides = React.Children.toArray(children)

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const { scrollLeft, scrollWidth, clientWidth } = track
    setAtStart(scrollLeft <= 4)
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 4)

    const first = track.firstElementChild as HTMLElement | null
    const step = first ? first.offsetWidth + 16 : clientWidth
    setIndex(Math.round(scrollLeft / Math.max(1, step)))
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    sync()
    track.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      track.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync, slides.length])

  const scrollBy = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current
      if (!track) return

      const first = track.firstElementChild as HTMLElement | null
      const step = first ? first.offsetWidth + 16 : track.clientWidth
      const { scrollLeft, scrollWidth, clientWidth } = track

      if (loop) {
        if (direction === 1 && scrollLeft + clientWidth >= scrollWidth - 4) {
          track.scrollTo({ left: 0, behavior: 'smooth' })
          return
        }
        if (direction === -1 && scrollLeft <= 4) {
          track.scrollTo({ left: scrollWidth, behavior: 'smooth' })
          return
        }
      }

      track.scrollBy({ left: step * direction, behavior: 'smooth' })
    },
    [loop],
  )

  const goTo = (target: number) => {
    const track = trackRef.current
    const first = track?.firstElementChild as HTMLElement | null
    if (!track || !first) return
    track.scrollTo({ left: (first.offsetWidth + 16) * target, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!autoPlay || paused || slides.length < 2) return undefined

    const timer = window.setInterval(() => {
      const track = trackRef.current
      if (!track) return
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
        track.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        scrollBy(1)
      }
    }, autoPlay)

    return () => window.clearInterval(timer)
  }, [autoPlay, paused, slides.length, scrollBy])

  return (
    <div
      className={['ui-carousel', `ui-carousel--${variant}`, className ?? '']
        .filter(Boolean)
        .join(' ')}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="ui-carousel__track" ref={trackRef}>
        {slides.map((slide, slideIndex) => (
          <div className="ui-carousel__slide" key={slideIndex}>
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <IconButton
            className="ui-carousel__arrow ui-carousel__arrow--prev"
            variant="outline"
            size={variant === 'hero' ? 'lg' : 'md'}
            label={t('home.previous')}
            icon={<ChevronLeftIcon />}
            disabled={!loop && atStart}
            onClick={() => scrollBy(-1)}
          />
          <IconButton
            className="ui-carousel__arrow ui-carousel__arrow--next"
            variant="outline"
            size={variant === 'hero' ? 'lg' : 'md'}
            label={t('home.next')}
            icon={<ChevronRightIcon />}
            disabled={!loop && atEnd}
            onClick={() => scrollBy(1)}
          />
        </>
      )}

      {showDots && slides.length > 1 && (
        <div className="ui-carousel__dots">
          {slides.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              className={dotIndex === index ? 'is-active' : ''}
              aria-label={t('home.goToSlide', { index: dotIndex + 1 })}
              onClick={() => goTo(dotIndex)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel
