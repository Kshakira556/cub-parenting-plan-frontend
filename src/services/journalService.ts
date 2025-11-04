// src/services/journalService.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const getJournalByChild = async (child_id: string) => {
  const res = await fetch(`${API_URL}/journal/child/${child_id}`);
  if (!res.ok) throw new Error("Failed to fetch journal entries");
  const data = await res.json();
  return data.entries;
};

export const createJournalEntry = async (entry: {
  child_id: string;
  author_id: string;
  content: string;
  entry_date: string;
}) => {
  const res = await fetch(`${API_URL}/journal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to create journal entry");
  const data = await res.json();
  return data.entry;
};
