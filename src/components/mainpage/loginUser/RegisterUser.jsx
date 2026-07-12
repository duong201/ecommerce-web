import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './LoginUserForm.scss'
import { registerUser } from '../../../common/api'
import { USER_LEVEL } from '../../../common/constants'
import { getErrorMessage, getErrorMessageFromCode } from '../../../common/utils/errorMessage'

const FIELD_BY_ERROR_CODE = {
  USERNAME_EXISTS: 'username',
  EMAIL_EXISTS: 'email',
  PHONE_EXISTS: 'phone',
}

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
  const [fieldErrors, setFieldErrors] = useState({})

  const register = () => {
    setFieldErrors({})
    registerUser({
      fullname,
      phone,
      email,
      username,
      password,
      level: USER_LEVEL.CUSTOMER,
    }, { silentError: true }).then((response) => {
      if (response.data.status === 'success') {
        history.push('/user/login')
      } else {
        const { code, message } = response.data
        const field = FIELD_BY_ERROR_CODE[code] || 'general'
        setFieldErrors({ [field]: getErrorMessageFromCode(code, message) })
      }
    }).catch((error) => {
      const field = FIELD_BY_ERROR_CODE[error.response?.data?.code] || 'general'
      setFieldErrors({ [field]: getErrorMessage(error) })
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
            {fieldErrors.fullname && <p className="status active">{fieldErrors.fullname}</p>}
            <input
              type="text"
              placeholder={initialValue.phone}
              name='phone'
              onChange={(e) => {
                setPhone(e.target.value)
              }}
            />
            {fieldErrors.phone && <p className="status active">{fieldErrors.phone}</p>}
            <input
              type="email"
              placeholder={initialValue.email}
              name='email'
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
            {fieldErrors.email && <p className="status active">{fieldErrors.email}</p>}
            <input
              type="text"
              placeholder={initialValue.username}
              name='username'
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
            {fieldErrors.username && <p className="status active">{fieldErrors.username}</p>}
            <input
              type="password"
              placeholder={initialValue.password}
              name='password'
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
            {fieldErrors.password && <p className="status active">{fieldErrors.password}</p>}
            {fieldErrors.general && <p className="status active">{fieldErrors.general}</p>}
            <button onClick={register}>Đăng ký</button>
            <p className="message">Đã có tài khoản, đăng nhập <Link to={`/user/login`} className="register-to-login">tại đây.</Link></p>
          </div>
        </div >
      </div>
    </>
  )
}

export default RegisterUser
