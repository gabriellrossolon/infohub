import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid } from "../utils/auth";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;