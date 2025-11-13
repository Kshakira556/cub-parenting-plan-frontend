const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const authFetch = async <T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${url}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  const data: T = await res.json();
  return data;
};
