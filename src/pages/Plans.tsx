import { useEffect, useState } from "react";
import { getPlans, createPlan, type ParentingPlan } from "../services/plansService";
import { useAuth } from "../context/AuthContext";

const Plans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<ParentingPlan[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"active" | "draft" | "archived">("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to load plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const newPlan = await createPlan({
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        status,
        created_by: user.id,
      });

      setPlans((prev) => [...prev, newPlan]);

      // reset form
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setStatus("active");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Parenting Plans</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label htmlFor="title" className="sr-only">Title</label>
          <input
            id="title"
            className="p-2 border rounded w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="sr-only">Description</label>
          <textarea
            id="description"
            className="p-2 border rounded w-full"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="start" className="sr-only">Start Date</label>
            <input
              id="start"
              type="date"
              className="p-2 border rounded w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label htmlFor="end" className="sr-only">End Date</label>
            <input
              id="end"
              type="date"
              className="p-2 border rounded w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <label htmlFor="status" className="sr-only">Plan Status</label>
        <select
        id="status"
        className="p-2 border rounded w-full"
        value={status}
        onChange={(e) => setStatus(e.target.value as typeof status)}
        >
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
        </select>

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

      {/* LIST */}
      <h2 className="text-xl font-bold mb-4">Existing Plans</h2>

      {plans.length === 0 ? (
        <p>No plans found.</p>
      ) : (
        <ul className="space-y-2">
          {plans.map((plan) => (
            <li key={plan.id} className="p-2 border rounded flex justify-between">
              <span>
                {plan.title} — {plan.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Plans;
