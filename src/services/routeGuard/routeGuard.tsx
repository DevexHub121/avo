import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const location = useLocation();
  const userData = Cookies.get("user_data");
  let isAuthenticated = false;

  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      isAuthenticated = !!parsedData?.auth_token;
    } catch (error) {
      console.error("Invalid JSON in user_data cookie:", error);
      isAuthenticated = false;
    }
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
