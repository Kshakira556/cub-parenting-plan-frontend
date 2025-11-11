import { useEffect, useState } from "react";
import { getVisitsByPlan } from "../services/visitsService";
import { getPlans } from "../services/plansService";
import type { ParentingPlan } from "../services/plansService";
import { formatDate } from "../utils/dateFormatter";

type Visit = {
  id: string;
  plan_id: string;
  child_id: string;
  parent_id: string;
  start_time: string;
  end_time: string;
  location: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
};

const Visits = () => {
  const [plans, setPlans] = useState<ParentingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load plans on page load
  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);

      if (data.length > 0) {
        setSelectedPlan(data[0].id); // auto-select first plan
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plans");
    }
  };

  // Load visits when selectedPlan changes
  const fetchVisits = async (planId: string) => {
    try {
      setLoading(true);
      const results = await getVisitsByPlan(planId);
      setVisits(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load visits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchVisits(selectedPlan);
    }
  }, [selectedPlan]);

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Visits</h1>

      {/* Plan selector */}
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

      {loading && <p>Loading visits...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {visits.length === 0 ? (
        <p>No visits for this plan.</p>
      ) : (
        <ul className="space-y-2">
          {visits.map((v) => (
            <li key={v.id} className="p-2 border rounded">
              <strong>{formatDate(v.start_time)}</strong>
              {" — "}
              {formatDate(v.end_time)}
              <div className="text-sm text-gray-600">
                Location: {v.location}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Visits;
