import { useEffect, useState } from "react";
import { getJournalByChild, createJournalEntry } from "../services/journalService";
import { getChildren } from "../services/childrenService";
import type { Child, JournalEntry as JournalEntryType } from "../types/api"; 
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/dateFormatter";

const Journal = () => {
  const { user } = useAuth();

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");

  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [content, setContent] = useState("");
  const [entryDate, setEntryDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load children
  const fetchChildren = async () => {
    try {
      const data = await getChildren();
      setChildren(data);

      // Auto-select first child if available
      if (data.length > 0) {
        setSelectedChild(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load children");
    }
  };

  // ✅ Load journal entries for selected child
  const fetchEntries = async (childId: string) => {
    try {
      setLoading(true);
      const entries = await getJournalByChild(childId);
      setEntries(entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchEntries(selectedChild);
    }
  }, [selectedChild]);

  // ✅ Create new journal entry
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedChild) return;

    try {
      setLoading(true);

      const newEntry = await createJournalEntry({
        child_id: selectedChild,
        author_id: user.id,
        entry_date: entryDate || new Date().toISOString(),
        content,
      });

      setEntries((prev) => [newEntry, ...prev]);
      setContent("");
      setEntryDate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Child Journal</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* CHILD SELECTOR */}
      <label htmlFor="child" className="sr-only">Select Child</label>
      <select
        id="child"
        className="p-2 border rounded w-full mb-4"
        value={selectedChild}
        onChange={(e) => setSelectedChild(e.target.value)}
      >
        {children.map((c) => (
          <option key={c.id} value={c.id}>
            {c.full_name}
          </option>
        ))}
      </select>

      {/* ENTRY LIST */}
      {entries.length === 0 ? (
        <p>No journal entries.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {entries.map((entry) => (
            <li key={entry.id} className="p-2 border rounded">
              <div className="text-sm text-gray-500">
                {formatDate(entry.entry_date)}
              </div>
              <div>{entry.content}</div>
            </li>
          ))}
        </ul>
      )}

      {/* NEW ENTRY FORM */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="date" className="sr-only">Entry Date</label>
        <input
          id="date"
          type="date"
          className="p-2 border rounded w-full"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
        />

        <label htmlFor="content" className="sr-only">Content</label>
        <textarea
          id="content"
          className="p-2 border rounded w-full"
          placeholder="Write journal entry..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Entry"}
        </button>
      </form>
    </div>
  );
};

export default Journal;
