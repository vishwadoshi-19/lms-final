// client/src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "../../server/context/AuthContext";
import Navbar from "./components/Navbar";
// import BookList from "./components/BookList";
import BookDetails from "./pages/BookDetails";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import EditBook from "./pages/EditBook";
import AddBook from "./pages/AddBook";
import Home from "./pages/Home";
import BorrowedBooks from "./components/BorrowedBooks";

// Protected Route component
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && auth.user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/borrowed-books" component={BorrowedBooks} />
        <Route
          path="/book/add"
          element={
            <ProtectedRoute adminOnly>
              <AddBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <EditBook />
            </ProtectedRoute>
          }
        />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
