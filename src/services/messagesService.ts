// src/services/messagesService.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
import { authFetch } from "../utils/api";

export const getMessagesByPlan = async (plan_id: string) => {
  const res = await authFetch(`${API_URL}/messages/plan/${plan_id}`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  const data = await res.json();
  return data.messages;
};

export const sendMessage = async (message: {
  sender_id: string;
  receiver_id: string;
  plan_id: string;
  content: string;
}) => {
  const res = await authFetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error("Failed to send message");
  const data = await res.json();
  return data.message;
};
