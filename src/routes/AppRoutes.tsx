import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Children from "../pages/Children"; 
import Dashboard from "../pages/Dashboard";
import Visits from "../pages/Visits";
import Messages from "../pages/Messages";
import Journal from "../pages/Journal";
import Plans from "../pages/Plans";
import NotFound from "../pages/NotFound";
import { useAuth } from "../context/AuthContext";

// Single ProtectedRoute wrapper for multiple routes
const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children ? <>{children}</> : <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes group */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children" element={<Children />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/journal" element={<Journal />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
