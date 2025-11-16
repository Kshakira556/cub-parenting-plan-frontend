import { useEffect, useState } from "react";
import { type ParentingPlan, type PlanInvite, type Child } from "../types/api";
import { getPlans, createPlan, inviteParent, acceptPlanInvite } from "../services/plansService";
import { getChildren } from "../services/childrenService";
import { useAuth } from "../context/AuthContext";
import type { CreatePlanPayload } from "../types/api"; 

const Plans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<ParentingPlan[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"active" | "draft" | "archived">("active");

  const [inviteInputs, setInviteInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch plans
  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to load plans");
    }
  };

  // Fetch children
  const fetchChildrenData = async () => {
    try {
      const data = await getChildren();
      setChildren(data);
    } catch (err) {
      console.error("Failed to fetch children", err);
    }
  };

  useEffect(() => {
    fetchChildrenData();
    fetchPlans();
  }, []);

  // Create new plan
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const payload: CreatePlanPayload = {
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        status,
        created_by: user.id,
        child_ids: selectedChildIds, // ✅ now allowed
      };

      const newPlan = await createPlan(payload);
      setPlans((prev) => [newPlan, ...prev]);

      // Reset form
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setStatus("active");
      setSelectedChildIds([]);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  // Invite parent
  const handleInvite = async (planId: string) => {
    const email = inviteInputs[planId];
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const invite: PlanInvite = await inviteParent(planId, email);
      alert(`Invite sent to ${invite.email}`);
      setInviteInputs((prev) => ({ ...prev, [planId]: "" }));

      setPlans((prevPlans) =>
        prevPlans.map((p) =>
          p.id === planId ? { ...p, invites: [...(p.invites || []), invite] } : p
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  // Accept invite
  const handleAcceptInvite = async (inviteId: string, planId: string) => {
    setLoading(true);
    setError(null);

    try {
      const updatedInvite = await acceptPlanInvite(inviteId);

      setPlans((prevPlans) =>
        prevPlans.map((p) =>
          p.id === planId
            ? { ...p, invites: p.invites?.map((i) => (i.id === inviteId ? updatedInvite : i)) }
            : p
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to accept invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Parenting Plans</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* CREATE PLAN FORM */}
      <form onSubmit={handleCreatePlan} className="mb-6 space-y-4">
        <div>
          <label htmlFor="plan-title" className="sr-only">Title</label>
          <input
            id="plan-title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="plan-description" className="sr-only">Description</label>
          <textarea
            id="plan-description"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="plan-start" className="sr-only">Start Date</label>
            <input
              id="plan-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="plan-end" className="sr-only">End Date</label>
            <input
              id="plan-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="plan-status" className="sr-only">Plan Status</label>
          <select
            id="plan-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="p-2 border rounded w-full"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Child Selection */}
        <div>
          <label htmlFor="plan-children" className="sr-only">Select Children</label>
          <select
            id="plan-children"
            multiple
            value={selectedChildIds}
            onChange={(e) =>
              setSelectedChildIds(Array.from(e.target.selectedOptions, (o) => o.value))
            }
            className="p-2 border rounded w-full mb-2"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.first_name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500">Hold Ctrl (Cmd) to select multiple children.</p>
        </div>

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Plan"}
        </button>
      </form>

      {/* EXISTING PLANS LIST */}
      <h2 className="text-xl font-bold mb-4">Existing Plans</h2>
      {plans.length === 0 ? (
        <p>No plans found.</p>
      ) : (
        <ul className="space-y-4">
          {plans.map((plan) => (
            <li key={plan.id} className="p-4 border rounded">
              <div className="flex justify-between items-center mb-2">
                <span>{plan.title} — {plan.status}</span>
              </div>

              {/* Invite UI */}
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  placeholder="Invite another parent..."
                  value={inviteInputs[plan.id] || ""}
                  onChange={(e) =>
                    setInviteInputs((prev) => ({ ...prev, [plan.id]: e.target.value }))
                  }
                  className="p-2 border rounded flex-1"
                />
                <button
                  onClick={() => handleInvite(plan.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  disabled={loading || !inviteInputs[plan.id]}
                >
                  Invite
                </button>
              </div>

              {/* List existing invites */}
              {plan.invites && plan.invites.length > 0 && (
                <ul className="space-y-1">
                  {plan.invites.map((invite: PlanInvite) => (
                    <li key={invite.id} className="flex justify-between items-center">
                      <span>{invite.email} — {invite.status}</span>
                      {invite.status === "pending" && invite.email === user?.email && (
                        <button
                          onClick={() => handleAcceptInvite(invite.id, plan.id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Accept
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Plans;
