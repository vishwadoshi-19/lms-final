import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        setAuth({
          token,
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        setAuth({
          token: null,
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    loadUser();
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({
      token,
      isAuthenticated: true,
      user,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({
      token: null,
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
