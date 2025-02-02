import React from 'react'
import TopNav from './components/TopNav'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'

//공통으로 쓸 컴포넌트 모아둔 레이아웃 공간
const Layout = () => {
  return (
    <div>
        <TopNav/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Layout;