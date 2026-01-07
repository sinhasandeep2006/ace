import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import UserProvider from "./context/UserContext";
import Home from "./pages/Home";
import Score from "./pages/Score";
import Game from "./pages/Game";

import LevelPassed from "./pages/LevelPassed";
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected */}
          <Route path="/home" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/level-passed" element={<LevelPassed />} />
          <Route path="/score" element={<Score />} />
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
