import {jwtDecode} from 'jwt-decode';

const isTokenExpired = (token:string) => {
  if (!token) return true;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    
    return decodedToken.exp !== undefined && decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export default isTokenExpired;