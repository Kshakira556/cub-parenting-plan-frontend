// src/services/visitsService.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
import { authFetch } from "../utils/api";

export const getVisitsByPlan = async (plan_id: string) => {
  const res = await authFetch(`${API_URL}/visits/plan/${plan_id}`);
  if (!res.ok) throw new Error("Failed to fetch visits");
  const data = await res.json();
  return data.visits;
};

export const addVisit = async (visit: {
  plan_id: string;
  child_id: string;
  parent_id: string;
  start_time: string;
  end_time: string;
  location: string;
  notes?: string;
}) => {
  const res = await authFetch(`${API_URL}/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visit),
  });
  if (!res.ok) throw new Error("Failed to create visit");
  const data = await res.json();
  return data.visit;
};
