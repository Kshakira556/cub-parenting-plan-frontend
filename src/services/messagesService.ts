// src/services/messagesService.ts
import { authFetch } from "../utils/api";
import type { Message, GetMessagesResponse, SendMessageResponse } from "../types/api";

export const getMessagesByPlan = async (plan_id: string): Promise<Message[]> => {
  const data = await authFetch<GetMessagesResponse>(`/messages/plan/${plan_id}`);
  return data.messages;
};

export const sendMessage = async (message: {
  sender_id: string;
  receiver_id: string;
  plan_id: string;
  content: string;
}): Promise<Message> => {
  const data = await authFetch<SendMessageResponse>("/messages", {
    method: "POST",
    body: JSON.stringify(message),
  });
  return data.message;
};
