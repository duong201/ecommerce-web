import React from 'react'
import './Footer.css'
import qrCodeImg from './images/qr-code.png'
import appStoreImg from './images/app-store.png'
import googlePlayImg from './images/google-play.png'

const footer = () => {
  const dataCustomerCare = [
    'Trung tâm trợ giúp',
    'Hướng dẫn mua hàng',
    'Hướng dẫn bán hàng',
    'Chăm sóc khách hàng',
    'Chính sách bảo hành',
  ]
  const dataAboutTipee = [
    'Giới thiệu về Tipee',
    'Điều khoản Tipee',
    'Chính sách bảo mật',
    'Kênh người bán',
    'Liên hệ với truyền thông',
  ]
  return (
    <>
      <footer className="footer">
        <div className="grid wide">
          <div className="row">
            <div className="c-6 m-4 l-2-4">
              <h3 className="footer__heading">Chăm sóc khách hàng</h3>
              <ul className="footer__list">
                {dataCustomerCare.map((value, index) => {
                  return (
                    <li className="footer__item" key={index}>
                      <button type="button" className="footer__link">
                        {value}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="c-6 m-4 l-2-4">
              <h3 className="footer__heading">Về Tipee</h3>
              <ul className="footer__list">
                {dataAboutTipee.map((value, index) => {
                  return (
                    <li className="footer__item" key={index}>
                      <button type="button" className="footer__link">
                        {value}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="c-6 m-4 l-2-4">
              <h3 className="footer__heading">Thanh toán</h3>
            </div>
            <div className="c-6 m-4 l-2-4">
              <h3 className="footer__heading">Theo dõi chúng tôi trên</h3>
              <ul className="footer__list">
                <li className="footer__item">
                  <button type="button" className="footer__link">
                    <i className="fa-brands fa-square-facebook"></i>
                    Facebook
                  </button>
                </li>
                <li className="footer__item">
                  <button type="button" className="footer__link">
                    <i className="fa-brands fa-square-instagram"></i>
                    Instagram
                  </button>
                </li>
                <li className="footer__item">
                  <button type="button" className="footer__link">
                    <i className="fa-brands fa-linkedin"></i>
                    Linkedin
                  </button>
                </li>
              </ul>
            </div>
            <div className="c-6 m-4 l-2-4">
              <h3 className="footer__heading">Tải ứng dụng Tipee ngay thôi</h3>
              <div className="footer__download">
                <img src={qrCodeImg} alt="" className="footer__download-qr" />
                <div className="footer__download-apps">
                  <img src={appStoreImg} alt="" className="footer__download-app-img" />
                  <img src={googlePlayImg} alt="" className="footer__download-app-img" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <p className="footer__text">@2022 - Bản quyền thuộc về Công ty Tipee</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default footer
