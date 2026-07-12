import React, { useEffect, useState } from 'react'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useHistory, useParams } from 'react-router-dom';
import AdminLayout from '../../../common/components/AdminLayout';
import { useFetch } from '../../../common/hooks/useFetch';
import { getUser, updateUser } from '../../../common/api';
import { NO_IMAGE_URL } from '../../../common/constants';

const EditingUser = () => (
  <AdminLayout>
    <EditInfoUser />
  </AdminLayout>
)

const EditInfoUser = () => {
  const { id } = useParams()
  const history = useHistory()

  const [file, setFile] = useState("")
  const { data: infoUser } = useFetch(() => getUser(id), [id], {})
  const [form, setForm] = useState({ fullname: '', phone: '', address: '', username: '', email: '', password: '', country: '' })

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

  const handleChange = (field) => (e) => {
    setForm((current) => ({ ...current, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUser(id, form).then(() => {
      history.push(`/admin/list-user/user/${id}`)
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
                            Image: <DriveFolderUploadIcon className='form-icon' />
                          </label>
                          <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            id="file"
                            style={{ display: 'none' }}
                          />
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Họ và tên</label>
                          <input
                            type="text"
                            placeholder='Họ và tên'
                            value={form.fullname}
                            onChange={handleChange('fullname')}
                          />
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Số điện thoại</label>
                          <input
                            type="text"
                            placeholder='Số điện thoại'
                            value={form.phone}
                            onChange={handleChange('phone')}
                          />
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Adress</label>
                          <input type="text" placeholder='Address' value={form.address} onChange={handleChange('address')} />
                        </div>
                      </div>
                    </div>
                    <div className="l-6 box-input">
                      <div>
                        <div className="form-input">
                          <label htmlFor="">UserName</label>
                          <input type="text" placeholder='duong2010' value={form.username} onChange={handleChange('username')} />
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Email</label>
                          <input type="email" placeholder='duong@gmail.com' value={form.email} onChange={handleChange('email')} />
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Passwork</label>
                          <input type="text" placeholder='duong@gmail.com' value={form.password} onChange={handleChange('password')} />
                        </div>
                        <div className="form-input">
                          <label htmlFor="">Country</label>
                          <input type="text" placeholder='VIE' value={form.country} onChange={handleChange('country')} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className='btn' type="submit">Send</button>
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
