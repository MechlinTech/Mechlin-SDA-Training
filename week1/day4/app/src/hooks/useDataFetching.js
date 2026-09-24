import { useCallback, useEffect, useState } from 'react';

export function useDataFetching(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const result = await response.json();
      setData(result);

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    Promise.resolve().then(() => fetchData()).catch(() => {});
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}