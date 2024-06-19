import React from 'react'
import HomeHeader from './HomeHeader'
import { Outlet } from "react-router-dom"

function HomeLayout() {
  return (
    <>
    <HomeHeader />
    <Outlet />
</>
  )
}

export default HomeLayout