import React, { ElementType, useEffect } from "react";
import { Navigate } from "react-router-dom";
import openNotification from "../ui/Notfication";
import { checkAuth } from "../../helpers/checkAuth";

type ProtectedRouteProps = {
  element: ElementType;
};

const ProtectedRoute = ({ element: Element, ...rest }: ProtectedRouteProps) => {
  const isAuthenticated =  checkAuth();

  
  useEffect(() => {
    console.log(isAuthenticated , "isAuthenticated");
    
    if (!isAuthenticated) {
      openNotification({
        type: "error",
        message: "Unauthenticated",
        description: "Please login to access this page",
      });
    }
  },[isAuthenticated]);


 
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
