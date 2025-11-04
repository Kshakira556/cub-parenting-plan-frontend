// src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from "react";

type FetchOptions = RequestInit & {
  skip?: boolean; // Optional: skip auto-fetch on mount
};

type UseFetchResult<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

export function useFetch<T>(url: string, options?: FetchOptions): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!options?.skip);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
        const res = await fetch(url, options);
        if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
        }

        const json: T = await res.json();
        setData(json);
    } catch (err: unknown) {
        if (err instanceof Error) {
        setError(err.message);
        } else {
        setError("Unknown error");
        }
        setData(null);
    } finally {
        setLoading(false);
    }
    }, [url, options]);

  useEffect(() => {
    if (!options?.skip) {
      fetchData();
    }
  }, [fetchData, options?.skip]);

  return { data, error, loading, refetch: fetchData };
}
