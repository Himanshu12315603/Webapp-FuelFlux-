// src/screens/OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");

      // Clean URL
      window.history.replaceState({}, document.title, "/video");
      navigate("/video");
    }  
  }, []);

  return <div>Logging you in...</div>;
};

export default OAuthCallback;
