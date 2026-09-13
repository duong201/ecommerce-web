import React from 'react'
import './Home.scss'
import CategoryBar from './CategoryBar'
import SlideCard from './SlideCard'

const Hero = () => (
  <section className="hero">
    <div className="grid wide">
      <SlideCard />
      <CategoryBar />
    </div>
  </section>
)

export default Hero
