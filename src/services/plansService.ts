import { authFetch } from "../utils/api";
import type { 
  ParentingPlan, 
  GetPlansResponse, 
  CreatePlanResponse, 
  PlanInvite 
} from "../types/api";

// Get all plans
export const getPlans = async (): Promise<ParentingPlan[]> => {
  const data = await authFetch<GetPlansResponse>("/plans");
  return data.plans;
};

// Create a new plan
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

// Invite another parent to join a plan
export const inviteParent = async (plan_id: string, email: string): Promise<PlanInvite> => {
  const data = await authFetch<{ invite: PlanInvite }>("/plans/invite", {
    method: "POST",
    body: JSON.stringify({ plan_id, email }),
  });
  return data.invite;
};

// Accept an invitation to join a plan
export const acceptPlanInvite = async (invite_id: string): Promise<PlanInvite> => {
  const data = await authFetch<{ invite: PlanInvite }>("/plans/accept", {
    method: "POST",
    body: JSON.stringify({ invite_id }),
  });
  return data.invite;
};
