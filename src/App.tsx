import { useCallback, useMemo, useState } from 'react';
import { useFetch } from './hooks/useFetch';
import { clientsUrl } from './api';
import { ClientCard } from './components/ClientCard';
import { ClientDetailModal } from './components/ClientDetailModal';
import { SearchBar } from './components/SearchBar';
import type { Client } from './types';
import styles from './App.module.css';

export default function App() {
  const clients = useFetch<Client[]>(clientsUrl);
  const [query, setQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const closeDetail = useCallback(() => setSelectedClient(null), []);

  const filteredClients = useMemo(() => {
    const list = clients.data ?? [];
    const q = query.trim().toLowerCase();
    if (q === '') return list;
    return list.filter(
      (client) =>
        client.name.toLowerCase().includes(q) ||
        client.company.name.toLowerCase().includes(q),
    );
  }, [clients.data, query]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Client Project Tracker</h1>
      </header>

      <div className={styles.toolbar}>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <main className={styles.main}>
        {clients.status === 'loading' && (
          <p className={styles.stateMessage}>Loading clients…</p>
        )}

        {clients.status === 'error' && (
          <div className={styles.stateMessage} role="alert">
            <p>Could not load clients: {clients.error}</p>
            <button className={styles.retryButton} onClick={clients.retry}>
              Try again
            </button>
          </div>
        )}

        {clients.status === 'success' && filteredClients.length === 0 && (
          <p className={styles.stateMessage}>
            No clients match “{query.trim()}”.
          </p>
        )}

        {clients.status === 'success' && filteredClients.length > 0 && (
          <ul className={styles.grid}>
            {filteredClients.map((client) => (
              <li key={client.id}>
                <ClientCard client={client} onSelect={setSelectedClient} />
              </li>
            ))}
          </ul>
        )}
      </main>

      {selectedClient !== null && (
        <ClientDetailModal client={selectedClient} onClose={closeDetail} />
      )}
    </div>
  );
}
