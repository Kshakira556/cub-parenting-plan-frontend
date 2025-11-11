import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Children from "../pages/Children"; 
import Dashboard from "../pages/Dashboard";
import Visits from "../pages/Visits";
import Messages from "../pages/Messages";
import Journal from "../pages/Journal";
import { useAuth } from "../context/AuthContext";
import Plans from "../pages/Plans";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return <>{user ? children : <Navigate to="/login" replace />}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
            <Children />
            <Plans />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visits"
        element={
          <ProtectedRoute>
            <Visits />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
