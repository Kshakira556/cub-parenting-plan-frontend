const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
import { authFetch } from "../utils/api";

export const login = async (email: string, password: string) => {
  const res = await authFetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res; 
};

export const register = async (
  full_name: string,
  email: string,
  password: string,
  role: string
) => {
  const validRoles = ["parent", "mediator", "admin"];
  if (!validRoles.includes(role)) {
    throw new Error("Invalid role. Must be parent, mediator, or admin.");
  }

  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name, email, password, role }),
  });

  if (!res.ok) {
    let message = "Registration failed";
    try {
      const errorData = await res.json();
      if (errorData?.issues && Array.isArray(errorData.issues)) {
        message = errorData.issues
          .map((i: { message: string }) => i.message)
          .join(", ");
      } else if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // ignore parsing error
    }
    throw new Error(message);
  }

  return res.json(); 
};
