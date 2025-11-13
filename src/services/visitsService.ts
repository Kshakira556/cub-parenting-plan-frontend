// src/services/visitsService.ts
import { authFetch } from "../utils/api";
import type { Visit, GetVisitsResponse, AddVisitResponse } from "../types/api";

export const getVisitsByPlan = async (plan_id: string): Promise<Visit[]> => {
  const data = await authFetch<GetVisitsResponse>(`/visits/plan/${plan_id}`);
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
}): Promise<Visit> => {
  const data = await authFetch<AddVisitResponse>("/visits", {
    method: "POST",
    body: JSON.stringify(visit),
  });
  return data.visit;
};
