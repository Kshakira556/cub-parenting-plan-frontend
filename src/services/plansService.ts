// src/services/plansService.ts
import { authFetch } from "../utils/api";
import type { ParentingPlan, GetPlansResponse, CreatePlanResponse } from "../types/api";

export const getPlans = async (): Promise<ParentingPlan[]> => {
  const data = await authFetch<GetPlansResponse>("/plans");
  return data.plans;
};

export const createPlan = async (plan: {
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: "active" | "draft" | "archived";
  created_by: string;
}): Promise<ParentingPlan> => {
  const data = await authFetch<CreatePlanResponse>("/plans", {
    method: "POST",
    body: JSON.stringify(plan),
  });
  return data.plan;
};
