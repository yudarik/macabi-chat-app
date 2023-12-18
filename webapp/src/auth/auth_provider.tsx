import {
  useNavigate, useLocation,
} from 'react-router-dom';
import {createContext, useContext, useMemo} from "react";
import request from "../protocols/api";

interface IAuthContext {
  isAuthenticated: boolean;
  user: {id: string, username: string}|null,
  authToken: string,
  onRegister: ({username, password}: {username: string, password: string}, onSuccess: (msg: string) => void, onError: (err: Error) => void) => void;
  onLogin: ({username, password}: {username: string, password: string}, onError: (err: Error) => void) => void;
  onLogout: () => void;
}

const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    user: null,
    authToken: '',
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
      const {id, username, token} = JSON.parse(auth);
      return {
        isAuthenticated: true,
        user: {id, username},
        authToken: token,
      };
    }
    return {
        isAuthenticated: false,
        user: null,
        authToken: null,
    }
  }, [localStorage.getItem('auth')]);

  const handleRegister = async ({username, password}: {username: string, password: string},
                                onSuccess: (msg: string) => void, onError: (err: Error) => void) => {
    try {
      const response = await request.post('/auth/register', {username, password});
      onSuccess('Successfully registered!');
    } catch (err) {
        console.log(err);
      onError(err.response.data);
    }
  }

  const handleLogin = async ({username, password}: {username: string, password: string}, onError: (err: Error) => void) => {
    // Perform login logic and set isAuthenticated to true upon successful login
    try {
        const response = await request.post('/auth/login', {username, password});
        localStorage.setItem('auth', JSON.stringify({
            id: response.data.id,
            username: response.data.username,
            token: response.data.token,
        }));
        const origin = location.state?.from?.pathname || '/chat';
        navigate(origin);
    } catch (err) {
        onError(err.response.data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  const value = {
    isAuthenticated,
    user,
    authToken,
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