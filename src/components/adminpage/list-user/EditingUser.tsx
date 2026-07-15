import React, { useEffect, useState } from 'react'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import { useHistory, useParams } from 'react-router-dom'
import AdminLayout from '../../../common/components/AdminLayout'
import { useFetch } from '../../../common/hooks/useFetch'
import { getUser, updateUser } from '../../../common/api'
import { NO_IMAGE_URL } from '../../../common/constants'
import { getErrorMessage, getErrorMessageFromCode } from '../../../common/utils/errorMessage'
import type { User } from '../../../interface'

const FIELD_BY_ERROR_CODE: Record<string, string> = {
  USERNAME_EXISTS: 'username',
  EMAIL_EXISTS: 'email',
  PHONE_EXISTS: 'phone',
}

type FieldErrors = Record<string, string>

interface UserForm {
  fullname: string
  phone: string
  address: string
  username: string
  email: string
  password: string
  country: string
}

const EditingUser = () => (
  <AdminLayout>
    <EditInfoUser />
  </AdminLayout>
)

const EditInfoUser = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()

  const [file, setFile] = useState<File | null>(null)
  const { data: infoUser } = useFetch<Partial<User>>(() => getUser(id), [id], {})
  const [form, setForm] = useState<UserForm>({
    fullname: '',
    phone: '',
    address: '',
    username: '',
    email: '',
    password: '',
    country: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    setForm({
      fullname: infoUser.fullname || '',
      phone: infoUser.phone || '',
      address: infoUser.address || '',
      username: infoUser.username || '',
      email: infoUser.email || '',
      password: infoUser.password || '',
      country: infoUser.country || '',
    })
  }, [infoUser])

  const handleChange = (field: keyof UserForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldErrors({})
    updateUser(id, form, { silentError: true })
      .then((response) => {
        if (response.data.status === 'error') {
          const { code, message } = response.data
          const field = (code && FIELD_BY_ERROR_CODE[code]) || 'general'
          setFieldErrors({ [field]: getErrorMessageFromCode(code, message) })
          return
        }
        history.push(`/admin/list-user/user/${id}`)
      })
      .catch((error) => {
        const field = FIELD_BY_ERROR_CODE[error.response?.data?.code] || 'general'
        setFieldErrors({ [field]: getErrorMessage(error) })
      })
  }

  return (
    <>
      <div className="editing-user-page">
        <div className="row" style={{ margin: 0 }}>
          <div className="l-12" style={{ padding: 10 }}>
            <div className="editing-user-title">
              <span>{id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</span>
            </div>
          </div>
        </div>
        <div className="row" style={{ margin: 0, padding: 10 }}>
          <div className="l-12 editing-user-body">
            <div className="row" style={{ margin: 0 }}>
              <div className="l-4 body-Img">
                <img src={file ? URL.createObjectURL(file) : NO_IMAGE_URL} alt="" />
              </div>
              <div className="l-8">
                <form onSubmit={handleSubmit}>
                  <div className="row" style={{ margin: 0, padding: 10 }}>
                    <div className="l-6 box-input">
                      <div>
                        <div className="form-input">
                          <label htmlFor="file">
                            Image: <DriveFolderUploadIcon className="form-icon" />
                          </label>
                          <input
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            id="file"
                            style={{ display: 'none' }}
                          />
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Họ và tên</label>
                          <input
                            type="text"
                            placeholder="Họ và tên"
                            value={form.fullname}
                            onChange={handleChange('fullname')}
                          />
                          {fieldErrors.fullname && (
                            <p className="form-error">{fieldErrors.fullname}</p>
                          )}
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Số điện thoại</label>
                          <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={form.phone}
                            onChange={handleChange('phone')}
                          />
                          {fieldErrors.phone && <p className="form-error">{fieldErrors.phone}</p>}
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Adress</label>
                          <input
                            type="text"
                            placeholder="Address"
                            value={form.address}
                            onChange={handleChange('address')}
                          />
                          {fieldErrors.address && (
                            <p className="form-error">{fieldErrors.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="l-6 box-input">
                      <div>
                        <div className="form-input">
                          <label htmlFor="">UserName</label>
                          <input
                            type="text"
                            placeholder="duong2010"
                            value={form.username}
                            onChange={handleChange('username')}
                          />
                          {fieldErrors.username && (
                            <p className="form-error">{fieldErrors.username}</p>
                          )}
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Email</label>
                          <input
                            type="email"
                            placeholder="duong@gmail.com"
                            value={form.email}
                            onChange={handleChange('email')}
                          />
                          {fieldErrors.email && <p className="form-error">{fieldErrors.email}</p>}
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Passwork</label>
                          <input
                            type="text"
                            placeholder="Mật khẩu"
                            value={form.password}
                            onChange={handleChange('password')}
                          />
                          {fieldErrors.password && (
                            <p className="form-error">{fieldErrors.password}</p>
                          )}
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Country</label>
                          <input
                            type="text"
                            placeholder="VIE"
                            value={form.country}
                            onChange={handleChange('country')}
                          />
                          {fieldErrors.country && (
                            <p className="form-error">{fieldErrors.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {fieldErrors.general && <p className="form-error">{fieldErrors.general}</p>}
                  <button className="btn" type="submit">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditingUser
