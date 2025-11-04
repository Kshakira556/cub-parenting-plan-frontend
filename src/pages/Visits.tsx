// src/pages/Visits.tsx
import { useEffect, useState } from "react";
import { getVisitsByPlan } from "../services/visitsService";

// Define Visit type
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
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    const fetchVisits = async () => {
      const data: Visit[] = await getVisitsByPlan("example-plan-id");
      setVisits(data);
    };
    fetchVisits();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Visits</h1>
      {visits.length === 0 ? (
        <p>No visits scheduled.</p>
      ) : (
        <ul className="space-y-2">
          {visits.map((v) => (
            <li key={v.id} className="p-2 border rounded">
              {v.start_time} - {v.end_time} at {v.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Visits;
