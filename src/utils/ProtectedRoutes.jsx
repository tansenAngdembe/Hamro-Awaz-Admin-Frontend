import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/loader/Loader.jsx";

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) return <Loader />;
  return isAuthenticated ? <Outlet /> : <Navigate to="login" />;
};

export default ProtectedRoutes;
