import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from "../auth/auth_provider";

export function ProtectedRoute({ children }) {
    const {isAuthenticated} = useAuth();
    const location = useLocation();

    return isAuthenticated ? children : <Navigate to="/auth" state={{from: location }} replace />;
}