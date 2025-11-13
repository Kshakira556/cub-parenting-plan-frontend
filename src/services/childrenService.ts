// src/services/childrenService.ts
import { authFetch } from "../utils/api";
import type { Child, GetChildrenResponse, CreateChildResponse } from "../types/api";

// Fetch all children
export const getChildren = async (): Promise<Child[]> => {
  const data = await authFetch<GetChildrenResponse>("/children");
  return data.children; // backend returns { children: Child[] }
};

// Create a new child
export const createChild = async (child: {
  first_name: string;
  birth_date: string;
  parent_id: string;
}): Promise<Child> => {
  const data = await authFetch<CreateChildResponse>("/children", {
    method: "POST",
    body: JSON.stringify(child),
  });
  return data.child;
};
