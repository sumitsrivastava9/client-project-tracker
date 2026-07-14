import { useCallback, useMemo, useRef, useState } from 'react';
import { useFetch } from './hooks/useFetch';
import { clientsUrl } from './api';
import { ClientCard } from './components/ClientCard';
import { ClientCount } from './components/ClientCount';
import { ClientDetailModal } from './components/ClientDetailModal';
import { NewProjectForm, type NewProjectValues } from './components/NewProjectForm';
import { SearchBar } from './components/SearchBar';
import type { Client, LocalProject } from './types';
import styles from './App.module.css';

export default function App() {
  const clients = useFetch<Client[]>(clientsUrl);
  const [query, setQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [localProjects, setLocalProjects] = useState<LocalProject[]>([]);
  const nextProjectId = useRef(1);

  const closeDetail = useCallback(() => setSelectedClient(null), []);
  const closeForm = useCallback(() => setIsFormOpen(false), []);

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

  const handleCreateProject = useCallback((values: NewProjectValues) => {
    setLocalProjects((prev) => [
      ...prev,
      { id: nextProjectId.current++, ...values },
    ]);
    setIsFormOpen(false);
  }, []);

  const selectedClientProjects = useMemo(
    () =>
      selectedClient === null
        ? []
        : localProjects.filter((project) => project.clientId === selectedClient.id),
    [localProjects, selectedClient],
  );

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Client Project Tracker</h1>
      </header>

      <div className={styles.toolbar}>
        <SearchBar value={query} onChange={setQuery} />
        <button
          type="button"
          className={styles.newProjectButton}
          onClick={() => setIsFormOpen(true)}
          disabled={clients.status !== 'success'}
        >
          + New Project
        </button>
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

        {clients.status === 'success' && (
          <ClientCount clients={clients.data} />
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
        <ClientDetailModal
          client={selectedClient}
          localProjects={selectedClientProjects}
          onClose={closeDetail}
        />
      )}

      {isFormOpen && clients.status === 'success' && (
        <NewProjectForm
          clients={clients.data}
          onSubmit={handleCreateProject}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
