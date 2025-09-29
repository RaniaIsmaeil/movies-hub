import { useEffect, useState } from "react";

export default function usePaged(fetcher, deps = []) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ results: [], total_pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetcher(page);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page, ...deps]);

  return { page, setPage, data, loading, error };
}
