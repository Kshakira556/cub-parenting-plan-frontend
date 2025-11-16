import { useEffect, useState } from "react";
import { getMessagesByPlan, sendMessage } from "../services/messagesService";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/dateFormatter";
import { getPlans } from "../services/plansService";
import type { ParentingPlan, Message as MessageType } from "../types/api";

// Import reusable form components
import TextInput from "../components/TextInput";
import FormButton from "../components/FormButton";
import Select from "../components/Select";

const Messages = () => {
  const { user } = useAuth();

  const [plans, setPlans] = useState<ParentingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageContent, setMessageContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user plans
  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);

      if (data.length > 0) setSelectedPlan(data[0].id);
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
    if (selectedPlan) fetchMessages(selectedPlan);
  }, [selectedPlan]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPlan) return;

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
      <Select
        id="plan"
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(e.target.value)}
        className="mb-4"
      >
        {plans.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title} — {p.status}
          </option>
        ))}
      </Select>

      {/* MESSAGE LIST */}
      {messages.length === 0 ? (
        <p>No messages for this plan.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {messages.map((msg) => (
            <li key={msg.id} className="p-2 border rounded">
              <div className="text-sm text-gray-500">{formatDate(msg.created_at)}</div>
              <div>{msg.content}</div>
            </li>
          ))}
        </ul>
      )}

      {/* SEND MESSAGE */}
      <form onSubmit={handleSend} className="flex gap-2">
        <TextInput
          id="message"
          placeholder="Type a message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          required
        />
        <FormButton type="submit" loading={loading}>
          Send
        </FormButton>
      </form>
    </div>
  );
};

export default Messages;
