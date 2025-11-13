// src/services/journalService.ts
import { authFetch } from "../utils/api";
import type { JournalEntry, GetJournalResponse, CreateJournalEntryResponse } from "../types/api";

export const getJournalByChild = async (child_id: string): Promise<JournalEntry[]> => {
  const data = await authFetch<GetJournalResponse>(`/journal/child/${child_id}`);
  return data.entries;
};

export const createJournalEntry = async (entry: {
  child_id: string;
  author_id: string;
  content: string;
  entry_date: string;
}): Promise<JournalEntry> => {
  const data = await authFetch<CreateJournalEntryResponse>("/journal", {
    method: "POST",
    body: JSON.stringify(entry),
  });
  return data.entry;
};
