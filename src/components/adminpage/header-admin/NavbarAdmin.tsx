import React from 'react'
import { Link } from 'react-router-dom'
import FontAwesomeIcon from 'react-fontawesome'

const NavbarAdmin = () => {
  return (
    <>
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Tìm kiếm..." name="" id="" />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <ul className="list">
          <li className="item">
            <Link to="/admin" className="link">
              <FontAwesomeIcon name="fa-light fa-globe" />
              <span className="language">VIE</span>
            </Link>
          </li>
          <li className="item">
            <Link to="/admin" className="link">
              <FontAwesomeIcon name="fa-light fa-moon" />
            </Link>
          </li>
          <li className="item">
            <Link to="/admin" className="link">
              <FontAwesomeIcon name="fa-solid fa-compress" />
            </Link>
          </li>
          <li className="item">
            <Link to="/admin" className="link">
              <i className="fa-regular fa-bell"></i>
              <div className="counter">9+</div>
            </Link>
          </li>
          <li className="item">
            <Link to="/admin" className="link">
              <FontAwesomeIcon name="fa-regular fa-message" />
              <div className="counter">9+</div>
            </Link>
          </li>
          <li className="item">
            <Link to="/admin" className="link">
              <i className="fa-solid fa-list"></i>
            </Link>
          </li>
          <li className="item">
            <Link to="/admin" className="link">
              <i className="fa-solid fa-user"></i>
            </Link>
          </li>
          <li className="item">
            <Link to="/admin" className="link">
              <FontAwesomeIcon name="fa-regular fa-gear" />
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default NavbarAdmin
