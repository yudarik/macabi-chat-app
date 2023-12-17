import {
  useNavigate, useLocation,
} from 'react-router-dom';
import {createContext, useContext, useMemo} from "react";
import request from "../protocols/api";

interface IAuthContext {
  isAuthenticated: boolean;
  user: string,
  authToken: string,
  onRegister: ({username, password}: {username: string, password: string}, onErrorCallback: (err: Error) => void) => void;
  onLogin: ({username, password}: {username: string, password: string}) => void;
  onLogout: () => void;
}

const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    user: '',
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

  const handleRegister = async ({username, password}: {username: string, password: string}, onError: (err: Error) => void) => {
    try {
      const response = await request.post('/auth/register', {username, password});
      await handleLogin({username, password});
    } catch (err) {
      console.error(err);
      onError(err as Error);
    }
  }

  const handleLogin = async ({username, password}: {username: string, password: string}) => {
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