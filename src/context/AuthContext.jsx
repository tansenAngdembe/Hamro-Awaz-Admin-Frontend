import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkAuth = async () => {
    if (isRefreshing) return;
    try {
      const response = await api.get("/checkAuth");
      if (
        response.data.code == 200 &&
        response.data.message == "AUTHENTICATED"
      ) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, [isRefreshing]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        checkAuth,
        isRefreshing,
        setIsRefreshing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
