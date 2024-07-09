import React, { useContext ,useEffect} from 'react';
import Home from '../pages/Home'
import InspectorHome from '../pages/InspectorHome'
import LibraryAdminHome from '../pages/LibraryAdminHome';
import AdminHome from '../pages/AdminHome';
import Footer from './Footer';
import { userContext } from '../src/App';

import { Outlet } from "react-router-dom"

function HomeLayout() {

  const { user } = useContext(userContext);
  

  // useEffect(() => {
  //   alert("nnnnnnnnn")
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/checkConnect');
  //       if (response.ok) {
  //         const userData = await response.json();
  //         setUser(userData);
  //       } else {
  //         throw new Error('Failed to fetch user data');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
        
  //     }
  //   };

 
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