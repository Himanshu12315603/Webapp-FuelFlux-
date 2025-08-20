import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    alert("Please login first!");
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
