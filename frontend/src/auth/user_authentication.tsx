import { useState } from "react";
import { UserRegister } from "../components/user_register";
import { UserLogin } from "../components/user_login";
import { useAuth } from "./auth_provider";

export function UserAuthentication() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { onLogin, onRegister } = useAuth();

  return (
    <div
      className={
        "absolute top-0 right-0 bottom-0 left-0 items-center justify-center"
      }
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-8 w-full max-w-md mb-4">
          {isRegistering ? (
            <UserRegister onRegister={onRegister} />
          ) : (
            <UserLogin onLogin={onLogin} />
          )}
        </div>
        <div className="text-center">
          {isRegistering ? (
            <p>
              Already have an account?{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => setIsRegistering(false)}
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => setIsRegistering(true)}
              >
                Register
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
