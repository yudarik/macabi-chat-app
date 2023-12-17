import {BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';

import Chat from "./components/chat";
import {UserAuthentication} from "./auth/user_authentication";
import {AuthProvider, useAuth} from "./auth/auth_provider";
import {ProtectedRoute} from "./components/protected_route";

const NoMatch = () => {
  return (
    <div>
      <h3>404 - Not found</h3>
    </div>
  );
}

const Navigation = () => {
  const { isAuthenticated, onLogout } = useAuth();
  return (
      <div className={'absolute top-0 w-full z-10'}>
        <nav className={'flex justify-end border-b-2 border-gray-500'}>
          {isAuthenticated && (
            <button type="button" className='' onClick={onLogout}>
              Sign Out
            </button>
          )}
        </nav>
      </div>
  );
};

const App = () => {

    return (
        <Router>
          <AuthProvider>
            <Navigation />
            <Routes>
              <Route index element={<UserAuthentication />} />
              <Route path="auth" element={<UserAuthentication />} />
              <Route path="chat" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
              }
              />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </AuthProvider>
        </Router>
    );
};

export default App;
