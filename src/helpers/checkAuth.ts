import isTokenExpired from "./checkExpired";

export const checkAuth =  () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return false;
  }

  const isExpired = isTokenExpired(token);

  
  if (isExpired) {
    return false;
  }

  return true;
};
