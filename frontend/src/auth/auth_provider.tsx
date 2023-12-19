import { useNavigate, useLocation } from "react-router-dom";
import { createContext, JSX, useContext, useMemo } from "react";
import request from "../protocols/api";

export interface IUser {
  id: string;
  username: string;
}

export interface UserFormData {
  username: string;
  password: string;
}

export interface IAuthContext {
  isAuthenticated: boolean;
  user: IUser | null;
  authToken: string;
  onRegister: (
    { username, password }: UserFormData,
    onSuccess: (msg: string) => void,
    onError: (err: { message: string }) => void,
  ) => void;
  onLogin: (
    { username, password }: UserFormData,
    onError: (err: { message: string }) => void,
  ) => void;
  onLogout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  user: null,
  authToken: "",
  onRegister: () => {},
  onLogin: () => {},
  onLogout: () => {},
});

export function AuthProvider(props: { children: JSX.Element[] | JSX.Element }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, authToken } = useMemo(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { id, username, token } = JSON.parse(auth);
      return {
        isAuthenticated: true,
        user: { id, username },
        authToken: token,
      };
    }
    return {
      isAuthenticated: false,
      user: null,
      authToken: null,
    };
  }, [localStorage.getItem("auth")]);

  const handleRegister = async (
    { username, password }: UserFormData,
    onSuccess: (msg: string) => void,
    onError: (err: { message: string }) => void,
  ) => {
    try {
      await request.post("/auth/register", { username, password });
      onSuccess("Successfully registered!");
    } catch (err: any) {
      console.log(err);
      onError(err?.response?.data as { message: string });
    }
  };

  const handleLogin = async (
    { username, password }: UserFormData,
    onError: (err: { message: string }) => void,
  ) => {
    // Perform login logic and set isAuthenticated to true upon successful login
    try {
      const response = await request.post("/auth/login", {
        username,
        password,
      });
      localStorage.setItem(
        "auth",
        JSON.stringify({
          id: response.data.id,
          username: response.data.username,
          token: response.data.token,
        }),
      );
      const origin = location.state?.from?.pathname || "/chat";
      navigate(origin);
    } catch (err: any) {
      onError(err?.response?.data as { message: string });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
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
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
