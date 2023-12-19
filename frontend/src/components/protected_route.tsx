import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/auth_provider";
import { JSX } from "react";

export function ProtectedRoute(props: {
  children: JSX.Element[] | JSX.Element;
}) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    props.children
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
}
