import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, createContext, useEffect } from "react";
import "./App.css";
import Layout from "../components/Layout";
import HomeLayout from "../components/HomeLayout";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Books from "../pages/Books";
import Messages from "../pages/Messages";
import UserBorrows from "../pages/UserBorrows";
import UserBooks from "../pages/UserBooks";
import NewBorrow from "../pages/NewBorrow";
import Logout from "../components/Logout";
import UserBook from "../pages/UserBook";
import ReturnedBooks from "../pages/ReturnedBooks";
import Borrows from "../pages/Borrows";
import Borrowers from "../pages/Borrowers";
import Inspectors from "../pages/Inspectors";
import Libraries from "../pages/Libraries";
import Borrower from "../pages/Borrower";
import NewLibrary from "../pages/NewLibrary";

export const userContext = createContext();

function App() {
  const [user, setUser] = useState();

  // Function to refresh user from cookie using JWT
  // const refreshUserFromCookie = async () => {
  //   const accessToken = document.cookie
  //     .split("; ")
  //     .find((c) => c.startsWith("accessToken="));
  //   if (!accessToken) return;
  //   console.log(accessToken)

  //   const jwt_decode = (await import('jwt-decode')).default;

  //   try {
  //     const decoded = jwt_decode(accessToken.split("=")[1]); // Decode token
  //     const userId = decoded.userId;

  //     fetch(`http://localhost:3000/user/${userId}`, {
  //       method: 'GET',
  //       credentials: 'include',
  //       headers: {
  //         Authorization: `Bearer ${accessToken.split("=")[1]}`, // Include token in Authorization header
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         alert("Data from server:", data.id); // Print the entire data received from the server
  //         if (data.user) {
  //           setUser(data.user);
  //           console.log("User set to context:", data.user); // Print the user being set in the context
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user:", error);
  //       });
  //   } catch (error) {
  //     console.error("Error decoding token:", error);
  //   }
  // };

  // useEffect(() => {
  //   refreshUserFromCookie(); // Call refresh function on component mount
  // }, [userContext]);


//   useEffect(()=>{
//     fetch(`http://localhost:3000/user/${userId}`,{)
//            method: 'GET',
//           credentials: 'include',
//           headers: {
//             Authorization: `Bearer ${accessToken.split("=")[1]}`, // Include token in Authorization header
//           },
// }})
//           .then((response) => response.json())
//           .then((data) => {

//   })
  return (
    <>
      <BrowserRouter>
        <userContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Books />} />
              <Route path="login" element={<Login />} />
              <Route path="sign-up" element={<SignUp />} />
            </Route>

            <Route path="/home" element={<HomeLayout />}>
              <Route index element={<NewBorrow />} />
              <Route path="new-borrow" element={<NewBorrow />} />
              <Route path="messages" element={<Messages />} />
              <Route path="user-borrows" element={<UserBorrows />} />
              <Route path="user-borrows/:id" element={<UserBook />} />
              <Route path="user-books" element={<UserBooks />} />
              <Route path="user-books/:id" element={<UserBook />} />
              <Route path="logout" element={<Logout />} />
            </Route>

            <Route path="/inspector-home" element={<HomeLayout />}>
              <Route index element={<ReturnedBooks />} />
              <Route path="returned-books" element={<ReturnedBooks />} />
              <Route path="borrows" element={<Borrows />} />
              <Route path="logout" element={<Logout />} />
            </Route>

            <Route path="/library-admin-home" element={<HomeLayout />}>
              <Route index element={<Books />} />
              <Route path="books" element={<Books />} />
              <Route path="inspectors" element={<Inspectors />} />
              <Route path="borrowers" element={<Borrowers />} />
              <Route path="borrowers/:id" element={<Borrower />} />
              <Route path="logout" element={<Logout />} />
            </Route>

            <Route path="/admin-home" element={<HomeLayout />}>
              <Route index element={<Libraries />} />
              <Route path="books" element={<Books />} />
              <Route path="libraries" element={<Libraries />} />
              <Route path="new-library" element={<NewLibrary />} />
              <Route path="logout" element={<Logout />} />
            </Route>
          </Routes>
        </userContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
