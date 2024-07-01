import React from 'react'
import InspectorHome from '../pages/InspectorHome'
import { Outlet } from "react-router-dom"

function InspectorHomeLayout() {
  return (
    <>
    <InspectorHome />
    <Outlet />
</>
  )
}

export default InspectorHomeLayout