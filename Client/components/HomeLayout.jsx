import React, { useContext ,useEffect} from 'react';
import Home from '../pages/Home'
import InspectorHome from '../pages/InspectorHome'
import LibraryAdminHome from '../pages/LibraryAdminHome';
import AdminHome from '../pages/AdminHome';
import Footer from './Footer';
import { userContext } from '../src/App';

import { Outlet } from "react-router-dom"

function HomeLayout() {

  const { user, setUser } = useContext(userContext);
 
  // useEffect(() => {
  //   fetch(`http://localhost:3000/checkConnect`, {
  //     method: 'GET',
  //     credentials: 'include'
  //   })
  //     .then((res) => res.json())
  //     .then((user) => {
  //       console.log("user " + user)
  //       setUser(user)
  //       console.log("1user " + {user})
  //     })
  //     .catch((error) => console.error('Error fetching user', error));
  // }, []);

  return (
    <>
      {user.roleId === 4 && <Home />}
      {user.roleId === 3 && <InspectorHome />}
      {user.roleId === 2 && <LibraryAdminHome />}
      {user.roleId === 1 && <AdminHome />}
      <Outlet />
      {/* {user.roleId === 4 && <Footer />} */}
    </>
  );
}

export default HomeLayout