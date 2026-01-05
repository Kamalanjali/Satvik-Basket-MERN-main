import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * Token-based guard (NO API CALLS)
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
