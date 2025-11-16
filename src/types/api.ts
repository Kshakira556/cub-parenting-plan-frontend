// src/types/api.ts

// ================= Auth / Users =================
export type User = {
  id: string;
  full_name: string;
  email: string;
  role: "parent" | "mediator" | "admin";
};

export type LoginResponse = {
  user: User;
  token: string;
};

export type RegisterResponse = LoginResponse;

// ================= Children =================
export type Child = {
  id: string;
  first_name: string;
  birth_date: string; // ISO string
  parent_id: string;
};

export type GetChildrenResponse = {
  children: Child[];
};

export type CreateChildResponse = {
  child: Child;
};

// For createChild payload
export type CreateChildPayload = {
  first_name: string;
  birth_date: string;
  parent_id: string;
};

// ================= Parenting Plans =================
export type ParentingPlan = {
  id: string;
  title: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status: "active" | "draft" | "archived";
  created_by: string;
  created_at: string;
  updated_at?: string | null;
  invites?: PlanInvite[];
  children?: Child[];
};

export type GetPlansResponse = {
  plans: ParentingPlan[];
};

export type CreatePlanResponse = {
  plan: ParentingPlan;
};

// **Added: payload type for creating a plan**
export type CreatePlanPayload = {
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: "active" | "draft" | "archived";
  created_by: string;
  child_ids?: string[]; // <-- this allows multi-child selection
};

// ================= Parenting Plan Invites =================
export type PlanInvite = {
  id: string;
  plan_id: string;
  email: string;
  status: "pending" | "accepted";
  created_at: string;
};

export type CreatePlanInviteResponse = {
  invite: PlanInvite;
};

export type AcceptPlanInvitePayload = {
  invite_id: string;
};

export type AcceptPlanInviteResponse = {
  invite: PlanInvite;
};

// ================= Visits =================
export type Visit = {
  id: string;
  plan_id: string;
  child_id: string;
  parent_id: string;
  start_time: string;
  end_time: string;
  location: string;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type GetVisitsResponse = {
  visits: Visit[];
};

export type AddVisitResponse = {
  visit: Visit;
};

// ================= Journal =================
export type JournalEntry = {
  id: string;
  child_id: string;
  plan_id?: string | null;
  author_id: string;
  entry_date: string;
  content?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type GetJournalResponse = {
  entries: JournalEntry[];
};

export type CreateJournalEntryResponse = {
  entry: JournalEntry;
};

// ================= Messages =================
export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  plan_id: string;
  content: string;
  created_at: string;
  is_flagged: boolean;
  flagged_reason?: string | null;
  is_deleted: boolean;
};

export type GetMessagesResponse = {
  messages: Message[];
};

export type SendMessageResponse = {
  message: Message;
};

// ================= Generic Error =================
export type APIError = {
  message: string;
  issues?: { message: string }[];
};
