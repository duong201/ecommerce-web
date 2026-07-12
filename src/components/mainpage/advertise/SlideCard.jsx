import React from 'react'
import Sdata from './Sdata'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"

const SlideCard = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  }
  return (
    <>
      <div className="slide-card">
        <Slider {...settings}>
          {
            Sdata.map((value, index) => {
              return(
                <div className="box" key={index}>
                  <div className="left">
                    <img src={value.coverImg} alt="" />
                  </div>
                  <div className="right">
                    <h1>{value.title}</h1>
                    <p>{value.description}</p>
                    <button className="btn">Visit Collections</button>
                  </div>
                </div>
              )
            })
          }
        </Slider>
      </div>
    </>
  )
}

export default SlideCard