import {
  useNavigate, useLocation,
} from 'react-router-dom';
import {createContext, useContext, useMemo, useState, useEffect} from "react";
import request from "../protocols/api";

interface IAuthContext {
  isAuthenticated: boolean;
  onRegister: ({username, password}, onErrorCallback) => void;
  onLogin: ({username, password}) => void;
  onLogout: () => void;
}

const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    onRegister: () => {},
    onLogin: () => {},
    onLogout: () => {},
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {isAuthenticated, user, authToken} = useMemo(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const {username, token} = JSON.parse(auth);
      return {
        isAuthenticated: true,
        user: username,
        authToken: token,
      };
    }
    return {
        isAuthenticated: false,
        user: null,
        authToken: null,
    }
  }, [localStorage.getItem('auth')]);

  const handleRegister = async ({username, password}, onError) => {
    try {
      const response = await request.post('/auth/register', {username, password});
      await handleLogin({username, password});
    } catch (err) {
      console.error(err);
      onError(err);
    }
  }

  const handleLogin = async ({ username, password }) => {
    // Perform login logic and set isAuthenticated to true upon successful login
    try {
        const response = await request.post('/auth/login', {username, password});
        localStorage.setItem('auth', JSON.stringify({
            username,
            token: response.data.token,
        }));
        //navigate(location?.state?.from ? location.state.from?.pathname : '/');
        const origin = location.state?.from?.pathname || '/chat';
        navigate(origin);
    } catch (err) {
        console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
  };

  const value = {
    isAuthenticated,
    onRegister: handleRegister,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}