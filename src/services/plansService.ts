import { authFetch } from "../utils/api";

export type ParentingPlan = {
  id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: "active" | "draft" | "archived";
  created_by: string;
  created_at: string;
  updated_at?: string;
};

export const getPlans = async (): Promise<ParentingPlan[]> => {
  const data = await authFetch("/plans");
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
  const data = await authFetch("/plans", {
    method: "POST",
    body: JSON.stringify(plan),
  });
  return data.plan; 
};
