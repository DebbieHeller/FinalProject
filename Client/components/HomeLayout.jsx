import React, { useContext } from 'react';
import Home from '../pages/Home'
import InspectorHome from '../pages/InspectorHome'
import LibraryAdminHome from '../pages/LibraryAdminHome';
import AdminHome from '../pages/AdminHome';
import { userContext } from '../src/App';

import { Outlet } from "react-router-dom"

function HomeLayout() {
  const { user } = useContext(userContext);

  return (
    <>
    {user.roleId == 4 && <Home />}
    {user.roleId == 3 && <InspectorHome />}
    {user.roleId == 2 && <LibraryAdminHome />}
    {user.roleId == 1 && <AdminHome />}
    <Outlet />
</>
  )
}

export default HomeLayout