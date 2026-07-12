import React from 'react'
import FlashCard from './FlashCard'
import './FlashDeals.css'

const FlashDeals = ({ products, seenProduct, addToCart }) => {
  return (
    <>
      <div className="flash-deals">
        <div className="container">
          <div className="heading">
            <span>
              <i className="fa-solid fa-bolt"></i>
              Flash Deals
            </span>
          </div>
          <FlashCard products={products} seenProduct={seenProduct} addToCart={addToCart} />
        </div>
      </div>
    </>
  )
}

export default FlashDeals