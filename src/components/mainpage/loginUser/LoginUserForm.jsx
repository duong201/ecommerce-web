import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './LoginUserForm.scss'
import { loginUser } from '../../../common/api'
import { setUserSession, setAdminSession } from '../../../common/utils/session'
import { USER_LEVEL } from '../../../common/constants'
import { getErrorMessage, getErrorMessageFromCode } from '../../../common/utils/errorMessage'

const LoginUserForm = () => {
  const initialValue = {
    initUsername: 'Tài khoản',
    initPassword: 'Mật khẩu',
  }

  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginStatus, setLoginStatus] = useState({})

  const login = () => {
    loginUser({ username, password }, { silentError: true })
      .then((response) => {
        const { message, status, code, result } = response.data

        if (status !== 'success') {
          setLoginStatus({ message: getErrorMessageFromCode(code, message) })
          document.querySelector('.status').classList.add('active')
          return
        }

        const account = result && result[0]
        if (!account) {
          setLoginStatus({ message: getErrorMessageFromCode(code, message) })
          document.querySelector('.status').classList.add('active')
          return
        }

        if (account.level === USER_LEVEL.ADMIN) {
          setAdminSession(account.id, account.username)
          history.push('/admin')
        } else {
          setUserSession(account.id, account.username)
          history.push('/')
        }
      })
      .catch((error) => {
        setLoginStatus({ message: getErrorMessage(error) })
        document.querySelector('.status').classList.add('active')
      })
  }

  return (
    <>
      <div className="box-loginUser">
        <div className="login-page">
          <div className="form">
            <input
              type="text"
              placeholder={initialValue.initUsername}
              name="username"
              onChange={(e) => {
                setUsername(e.target.value)
                document.querySelector('.status').classList.remove('active')
              }}
            />
            <input
              type="password"
              placeholder={initialValue.initPassword}
              name="passwork"
              onChange={(e) => {
                setPassword(e.target.value)
                document.querySelector('.status').classList.remove('active')
              }}
            />
            <p className="status">{loginStatus.message}</p>
            <button onClick={login}>Đăng nhập</button>
            <p className="message">
              Tạo tài khoản mới{' '}
              <Link to={`/user/register`} className="login-to-register">
                tại đây.
              </Link>
            </p>
            <Link to="/" className="gotohome">
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginUserForm
