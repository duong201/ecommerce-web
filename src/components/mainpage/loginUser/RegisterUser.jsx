import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './LoginUserForm.scss'
import { registerUser } from '../../../common/api'
import { USER_LEVEL } from '../../../common/constants'

const RegisterUser = () => {
  const initialValue = {
    fullname: 'Họ và tên',
    phone: 'Số điện thoại',
    email: 'Email',
    username: 'Tên tài khoản',
    password: 'Mật khẩu'
  }

  const history = useHistory()

  const [fullname, setFullname] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const register = () => {
    registerUser({
      fullname,
      phone,
      email,
      username,
      password,
      level: USER_LEVEL.CUSTOMER,
    }).then((response) => {
      if (response.data.status === 'success') {
        history.push('/user/login')
      } else {
        setError(response.data.message || 'Đăng ký thất bại, vui lòng thử lại.')
      }
    }).catch(() => {
      setError('Đăng ký thất bại, vui lòng thử lại.')
    })
  }

  return (
    <>
      <div className="box-loginUser">
        <div className="register-page nonActive">
          <div className="form">
            <input
              type="text"
              placeholder={initialValue.fullname}
              name='fullname'
              onChange={(e) => {
                setFullname(e.target.value)
              }}
            />
            <input
              type="text"
              placeholder={initialValue.phone}
              name='phone'
              onChange={(e) => {
                setPhone(e.target.value)
              }}
            />
            <input
              type="email"
              placeholder={initialValue.email}
              name='email'
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
            <input
              type="text"
              placeholder={initialValue.username}
              name='username'
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
            <input
              type="password"
              placeholder={initialValue.password}
              name='password'
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
            {error && <p className="status active">{error}</p>}
            <button onClick={register}>Đăng ký</button>
            <p className="message">Đã có tài khoản, đăng nhập <Link to={`/user/login`} className="register-to-login">tại đây.</Link></p>
          </div>
        </div >
      </div>
    </>
  )
}

export default RegisterUser
