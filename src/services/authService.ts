// src/services/authService.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const register = async (full_name: string, email: string, password: string, role: string) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name, email, password, role }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};
