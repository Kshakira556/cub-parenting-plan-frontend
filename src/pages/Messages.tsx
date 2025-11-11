import { useEffect, useState } from "react";
import { getMessagesByPlan, sendMessage } from "../services/messagesService";
import { getPlans, type ParentingPlan } from "../services/plansService";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/dateFormatter";

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
  const { user } = useAuth();

  const [plans, setPlans] = useState<ParentingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user plans
  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);

      // Auto-select first plan
      if (data.length > 0) {
        setSelectedPlan(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plans");
    }
  };

  // Load messages when selected plan changes
  const fetchMessages = async (planId: string) => {
    try {
      setLoading(true);
      const data = await getMessagesByPlan(planId);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchMessages(selectedPlan);
    }
  }, [selectedPlan]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!selectedPlan) return;

    try {
      setLoading(true);

      const newMessage = await sendMessage({
        sender_id: user.id,
        receiver_id: user.id, // TODO: update when users can message each other
        plan_id: selectedPlan,
        content: messageContent,
      });

      setMessages((prev) => [...prev, newMessage]);
      setMessageContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* PLAN SELECTOR */}
      <label htmlFor="plan" className="sr-only">Select Plan</label>
      <select
        id="plan"
        className="p-2 border rounded w-full mb-4"
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(e.target.value)}
      >
        {plans.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title} — {p.status}
          </option>
        ))}
      </select>

      {/* MESSAGE LIST */}
      {messages.length === 0 ? (
        <p>No messages for this plan.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {messages.map((msg) => (
            <li key={msg.id} className="p-2 border rounded">
              <div className="text-sm text-gray-500">
                {formatDate(msg.created_at)}
              </div>
              <div>{msg.content}</div>
            </li>
          ))}
        </ul>
      )}

      {/* SEND MESSAGE */}
      <form onSubmit={handleSend} className="flex gap-2">
        <label htmlFor="message" className="sr-only">Message</label>
        <input
          id="message"
          className="p-2 border rounded flex-1"
          placeholder="Type a message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Messages;
