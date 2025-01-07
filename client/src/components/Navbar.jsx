import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../server/context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Library Management
        </Link>

        {!auth.isAuthenticated && (
          <Link to="/register" className="text-white text-xl font-bold">
          Register
        </Link>
        )}

        {auth.isAuthenticated && (
          <div className="flex items-center space-x-4">
            <span className="text-white">
              Welcome,{" "}
              {auth.user.role === "admin" ? "Admin" : auth.user.username}
            </span>

            {auth.user.role === "admin" && (
              <Link to="/dashboard" className="text-white hover:text-gray-300">
                Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar
