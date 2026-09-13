import React from 'react'
import Hero from '../components/mainpage/advertise/Home'
import FlashDeals from '../components/mainpage/flashDeals/FlashDeals'
import Suggest from '../components/mainpage/suggest/Suggest'

/** The storefront landing page: hero + category rail, markdowns, then the grid. */
const HomePage = () => (
  <div className="home-page">
    <Hero />
    <FlashDeals />
    <Suggest />
  </div>
)

export default HomePage
