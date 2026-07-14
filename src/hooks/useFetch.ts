import { useCallback, useEffect, useState } from 'react';

type FetchState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'error'; data: null; error: string }
  | { status: 'success'; data: T; error: null };

const LOADING = { status: 'loading', data: null, error: null } as const;

/**
 * Fetches JSON from the given URL and exposes loading / error / success
 * state. Pass `null` to skip fetching (e.g. while no client is selected).
 * In-flight requests are aborted on unmount or URL change, so stale
 * responses never overwrite newer state.
 */
export function useFetch<T>(url: string | null) {
  const [state, setState] = useState<FetchState<T>>(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (url === null) {
      setState(LOADING);
      return;
    }

    const controller = new AbortController();
    setState(LOADING);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json() as Promise<T>;
      })
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setState({ status: 'error', data: null, error: message });
      });

    return () => controller.abort();
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { ...state, retry };
}
