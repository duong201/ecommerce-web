import React from 'react'
import './HomePage.scss'
import Widget from '../widget/Widget'
import Chart from '../Chart/Chart'
import Featured from '../featured/Featured'
import ListTable from '../list-table/ListTable'
import { useFetch } from '../../../common/hooks/useFetch'
import { getProducts } from '../../../common/api'

const HomePage = () => {
  const { data: products } = useFetch(getProducts, [])

  return (
    <>
      <div className="home-page">
        <div className="row" style={{ margin: '0' }}>
          <div className="c-12 m-6 l-3 box-widget">
            <Widget type="user" />
          </div>
          <div className="c-12 m-6 l-3 box-widget">
            <Widget type="product" />
          </div>
          <div className="c-12 m-6 l-3 box-widget">
            <Widget type="order" />
          </div>
          <div className="c-12 m-6 l-3 box-widget">
            <Widget type="balance" />
          </div>
        </div>

        <div className="row" style={{ margin: '0' }}>
          <div className="c-12 m-12 l-4 box-featured">
            <Featured />
          </div>
          <div className="c-12 m-12 l-8 box-chart">
            <Chart />
          </div>
        </div>

        <div className="row" style={{ margin: '0' }}>
          <div className="l-12 box-listContainer">
            <div className="listContainer">
              <span className="listContainer-header">Top 10 bán chạy</span>
              <ListTable products={products} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
