import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";

// ── Auth Context ──────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#09090f" }}>
        <div style={{ textAlign: "center", color: "#6366f1" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>✦</div>
          <div style={{ fontSize: "14px", color: "#64748b" }}>Loading SmartCV...</div>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.get("/api/auth/me")
      .then((res) => { setUser(res.data.user); })
      .catch(() => { localStorage.removeItem("token"); })
      .finally(() => { setLoading(false); });
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/builder/:id?" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
