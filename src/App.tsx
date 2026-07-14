import { useFetch } from './hooks/useFetch';
import { clientsUrl } from './api';
import type { Client } from './types';
import styles from './App.module.css';

export default function App() {
  const clients = useFetch<Client[]>(clientsUrl);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Client Project Tracker</h1>
      </header>

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

        {clients.status === 'success' && (
          <ul>
            {clients.data.map((client) => (
              <li key={client.id}>{client.name}</li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
