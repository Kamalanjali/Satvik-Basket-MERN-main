import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authApi } from "../services/api";

function PublicRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    authApi
      .me()
      .then(() => setAllowed(false)) // user logged in
      .catch(() => setAllowed(true)); // not logged in
  }, []);

  if (allowed === null) {
    return null; // or a spinner
  }

  return allowed ? children : <Navigate to="/" replace />;
}

export default PublicRoute;
