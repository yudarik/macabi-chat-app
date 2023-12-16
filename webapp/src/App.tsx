import {BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';

import Chat from "./components/chat";
import Auth from "./components/auth";
import {AuthProvider, useAuth} from "./components/auth_provider";
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
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/chat">Chat</NavLink>
      {isAuthenticated && (
        <button type="button" onClick={onLogout}>
          Sign Out
        </button>
      )}
    </nav>
  );
};

const App = () => {

    return (
        <Router>
          <AuthProvider>
            <Navigation />
            <Routes>
              <Route index element={<Auth />} />
              <Route path="auth" element={<Auth />} />
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
