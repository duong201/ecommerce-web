import React from 'react'
import './Featured.scss'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const Featured = () => {
  return (
    <>
      <div className="featured">
        <div className="featured-header">
          <span>Total Revenue</span>
          <MoreVertOutlinedIcon className="featured-icon" />
        </div>
        <div className="featured-content">
          <div className="featured-chart">
            <CircularProgressbar value={70} text={'70%'} strokeWidth="5" />
          </div>
          <p className="title">Total sales made today</p>
          <p className="amount">$420</p>
          {/* <p className="description">Previous transactions processing. Last payments may not be included.</p> */}
        </div>
        {/* <div className="featured-sumary">
          <div className="item">
            <span className="title">Target</span>
            <div className="result negative">
              <ExpandMoreOutlinedIcon className='icon' />
              <span className="amount">$12.4k</span>
            </div>
          </div>
          <div className="item">
            <span className="title">Target</span>
            <div className="result positive">
              <ExpandLessIcon className='icon' />
              <span className="amount ">$12.4k</span>
            </div>
          </div>
          <div className="item">
            <span className="title">Target</span>
            <div className="result negative">
              <ExpandMoreOutlinedIcon className='icon' />
              <span className="amount">$12.4k</span>
            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}

export default Featured
