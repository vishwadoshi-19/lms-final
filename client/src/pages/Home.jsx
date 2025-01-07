import React from "react";
import BookList from "../components/BookList";
import BorrowedBooks from "../components/BorrowedBooks";
// import UserBooks from "../components/UserBooks";
// import { AuthProvider, useAuth } from "../../../server/context/AuthContext";


const Home = () => {
    // const { auth } = useAuth();
    // console.log(auth);
    // const isAdmin = auth.user.role == 'admin';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Library Management System</h1>
      <BookList />
      {/* {isAdmin && <UserBooks />} */}
      {/* <BorrowedBooks/> */}
    </div>
  );
};

export default Home;
