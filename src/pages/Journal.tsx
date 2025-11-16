import { useEffect, useState } from "react";
import { getJournalByChild, createJournalEntry } from "../services/journalService";
import { getChildren } from "../services/childrenService";
import type { Child, JournalEntry as JournalEntryType } from "../types/api";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/dateFormatter";

// Reusable components
import Select from "../components/Select";
import TextInput from "../components/TextInput";
import TextArea from "../components/TextArea";
import FormButton from "../components/FormButton";

const Journal = () => {
  const { user } = useAuth();

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");

  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [content, setContent] = useState("");
  const [entryDate, setEntryDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = async () => {
    try {
      const data = await getChildren();
      setChildren(data);
      if (data.length > 0) setSelectedChild(data[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load children");
    }
  };

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
    if (selectedChild) fetchEntries(selectedChild);
  }, [selectedChild]);

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
      <Select
        id="child"
        value={selectedChild}
        onChange={(e) => setSelectedChild(e.target.value)}
        className="mb-4"
      >
        {children.map((c) => (
          <option key={c.id} value={c.id}>
            {c.first_name}
          </option>
        ))}
      </Select>

      {/* ENTRY LIST */}
      {entries.length === 0 ? (
        <p>No journal entries.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {entries.map((entry) => (
            <li key={entry.id} className="p-2 border rounded">
              <div className="text-sm text-gray-500">{formatDate(entry.entry_date)}</div>
              <div>{entry.content}</div>
            </li>
          ))}
        </ul>
      )}

      {/* NEW ENTRY FORM */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <TextInput
          id="date"
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          placeholder="Entry Date"
        />

        <TextArea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write journal entry..."
          required
        />

        <FormButton type="submit" loading={loading}>
          Add Entry
        </FormButton>
      </form>
    </div>
  );
};

export default Journal;
