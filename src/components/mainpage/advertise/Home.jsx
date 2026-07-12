import React from 'react'
import Categories from './Categories'
import Slider from './Slider'

const Home = () => {
  return (
    <>
      <div className="c-12 m-12 l-2">
        <Categories />
      </div>
      <div className="c-12 m-12 l-10">
        <Slider />
      </div>
    </>
  )
}

export default Home
