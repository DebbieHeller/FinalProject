import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, createContext } from "react";
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
import InspectorHomeLayout from "../components/InspectorHomeLayout"
import ReturnedBooks from "../pages/ReturnedBooks"
import Borrows from "../pages/Borrows"

export const userContext = createContext();

function App() {
  const [user, setUser] = useState();

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
            
            <Route path="/inspector-home" element={<InspectorHomeLayout />}>
              <Route index element={<ReturnedBooks />} />
              <Route path="retuened-books" element={<ReturnedBooks />} />
              <Route path="borrows" element={<Borrows />} />
              <Route path="logout" element={<Logout />} />
            </Route>

          </Routes>
        </userContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
