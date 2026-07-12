import React from 'react'
import FlashDeals from '../components/mainpage/flashDeals/FlashDeals'
import Home from '../components/mainpage/advertise/Home'
import Suggest from '../components/mainpage/suggest/Suggest'

const Pages = ({ products, addToCart, seenProduct }) => {
  return (
    <>
      <div className="home">
        <div className="grid wide">
          <div className="mgt-32 row">
            <Home />
          </div>
          <div className="mgt-32 row">
            <FlashDeals products={products} seenProduct={seenProduct} addToCart={addToCart} />
          </div>
          <div className="row">
            <Suggest products={products} seenProduct={seenProduct} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Pages