// src/pages/Messages.tsx
import { useEffect, useState } from "react";
import { getMessagesByPlan } from "../services/messagesService";

// Define the message type
type Message = {
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

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const data: Message[] = await getMessagesByPlan("example-plan-id");
      setMessages(data);
    };
    fetchMessages();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="space-y-2">
          {messages.map((msg) => (
            <li key={msg.id} className="p-2 border rounded">
              <strong>{msg.sender_id}</strong>: {msg.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
