import type { Client } from '../types';
import styles from './ClientCount.module.css';

interface ClientCountProps {
  clients: Client[];
}

/**
 * Fixed version of the assessment's buggy snippet.
 *
 * The original kept the count in useState and set it from a useEffect
 * with an empty dependency array, so it only ran on mount and the count
 * stayed stale (0, since clients load asynchronously). The count is
 * derived data, so it is computed directly from props instead: no state,
 * no effect, and it can never fall out of sync.
 *
 * The snippet's second bug, a missing key prop in clients.map(), is
 * fixed where the list actually renders (see App.tsx).
 */
export function ClientCount({ clients }: ClientCountProps) {
  return <p className={styles.count}>Total clients: {clients.length}</p>;
}
