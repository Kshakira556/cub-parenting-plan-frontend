import { useEffect, useState } from "react";
import { getJournalByChild } from "../services/journalService";

type JournalEntry = {
  id: string;
  child_id: string;
  plan_id?: string | null;
  author_id: string;
  entry_date: string;
  content?: string;
  created_at: string;
  updated_at?: string;
};

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getJournalByChild("example-child-id");
      setEntries(data);
    };
    fetchEntries();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Child Journal</h1>
      {entries.length === 0 ? (
        <p>No journal entries.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="p-2 border rounded">
              <strong>{entry.entry_date}</strong>: {entry.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Journal;
