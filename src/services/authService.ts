import { authFetch } from "../utils/api";
import type { LoginResponse, RegisterResponse, APIError } from "../types/api";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return authFetch<LoginResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (
  full_name: string,
  email: string,
  password: string,
  role: "parent" | "mediator" | "admin"
): Promise<RegisterResponse> => {
  if (!["parent", "mediator", "admin"].includes(role)) {
    throw new Error("Invalid role. Must be parent, mediator, or admin.");
  }

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name, email, password, role }),
  });

  if (!res.ok) {
    let message = "Registration failed";
    try {
      const data: APIError = await res.json();
      if (data?.issues?.length) {
        message = data.issues.map(i => i.message).join(", ");
      } else if (data?.message) {
        message = data.message;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
};
