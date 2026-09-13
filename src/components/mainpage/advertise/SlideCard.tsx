import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Sdata from './Sdata'
import { Carousel } from '../../../common/components/ui'

const SlideCard = () => {
  const { t } = useTranslation()

  return (
    <Carousel
      variant="hero"
      autoPlay={6000}
      loop
      showDots
      ariaLabel={t('home.promotionsAria')}
      className="hero__promo"
    >
      {Sdata.map((slide) => (
        <article className={`promo-slide promo-slide--${slide.tone}`} key={slide.id}>
          <div className="promo-slide__text">
            <p className="promo-slide__eyebrow">{t(`home.slides.${slide.id}.eyebrow`)}</p>
            <h2>{t(`home.slides.${slide.id}.title`)}</h2>
            <p className="promo-slide__body">{t(`home.slides.${slide.id}.description`)}</p>
            <Link className="ui-btn ui-btn--primary ui-btn--lg" to={slide.href}>
              {t(`home.slides.${slide.id}.cta`)}
            </Link>
          </div>
          <div className="promo-slide__media">
            <img src={slide.coverImg} alt={t(`home.slides.${slide.id}.alt`)} />
          </div>
        </article>
      ))}
    </Carousel>
  )
}

export default SlideCard
