import { authFetch } from "../utils/api";

export type Child = {
  id: string;
  full_name: string;
  date_of_birth: string;
  parent_id: string;
};

export const getChildren = async (): Promise<Child[]> => {
  const data = await authFetch("/children");
  return data.children; // backend returns { children: Child[] }
};

export const createChild = async (child: {
  full_name: string;
  date_of_birth: string;
  parent_id: string;
}): Promise<Child> => {
  const newChild = await authFetch("/children", {
    method: "POST",
    body: JSON.stringify(child),
  });
  return newChild.child; 
};
