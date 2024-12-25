import { Navigate } from "react-router-dom";

export const RoleBasedRoute = ({ element, allowedRoles }: any) => {
  const userRoles = [
    "super-admin",
    "admin",
    "manager-admin",
    "accountant-admin",
  ]; // Example user roles

  const availableRoutes: any = {
    "super-admin": "/",
    admin: "/users",
    "manager-admin": "/users",
    "accountant-admin": "/",
  };
  const userRole = JSON.parse(localStorage.getItem("role") || "null");
  console.log(allowedRoles, userRole, "userRole");

  if (allowedRoles.includes(userRole)) {
    return element;
  } else {
    return <Navigate to={availableRoutes[userRole] || "/"} />;
  }
};
