import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authApi } from "../services/api";

function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    authApi
      .me()
      .then(() => setAllowed(true))   // logged in
      .catch(() => setAllowed(false)); // not logged in
  }, []);

  if (allowed === null) return null; // or loader

  return allowed ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
