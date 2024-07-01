import React from 'react'
import Home from '../pages/Home'
import { Outlet } from "react-router-dom"

function HomeLayout() {
  return (
    <>
    <Home />
    <Outlet />
</>
  )
}

export default HomeLayout