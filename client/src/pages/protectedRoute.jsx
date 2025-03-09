/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import

const ProtectedRoute = ({ children }) => {
  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true; // No token means it's "expired"

    try {
      const decoded = jwtDecode(token); // Use the named export
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decoded.exp < currentTime; // Token is expired if `exp` is in the past
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // If decoding fails, assume the token is expired
    }
  };

  const token = localStorage.getItem("token"); // Retrieve the token from storage

  // Redirect to login if the token is missing or expired
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/prijava" replace />;
  }

  // Render the children (protected component) if the token is valid
  return children;
};

export default ProtectedRoute;
