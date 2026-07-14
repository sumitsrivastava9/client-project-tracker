import { useFetch } from '../hooks/useFetch';
import { projectsUrl } from '../api';
import { getInitials } from '../utils';
import { Modal } from './Modal';
import type { Client, Project } from '../types';
import styles from './ClientDetailModal.module.css';

interface ClientDetailModalProps {
  client: Client;
  onClose: () => void;
}

export function ClientDetailModal({ client, onClose }: ClientDetailModalProps) {
  const projects = useFetch<Project[]>(projectsUrl(client.id));

  return (
    <Modal title={client.name} onClose={onClose}>
      <div className={styles.identity}>
        <span className={styles.avatar} aria-hidden="true">
          {getInitials(client.name)}
        </span>
        <div>
          <p className={styles.company}>{client.company.name}</p>
          <p className={styles.catchPhrase}>“{client.company.catchPhrase}”</p>
        </div>
      </div>

      <dl className={styles.details}>
        <div className={styles.detailRow}>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${client.email}`}>{client.email}</a>
          </dd>
        </div>
        <div className={styles.detailRow}>
          <dt>Phone</dt>
          <dd>{client.phone}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt>Website</dt>
          <dd>
            <a
              href={`https://${client.website}`}
              target="_blank"
              rel="noreferrer"
            >
              {client.website}
            </a>
          </dd>
        </div>
        <div className={styles.detailRow}>
          <dt>Address</dt>
          <dd>
            {client.address.suite}, {client.address.street},{' '}
            {client.address.city} {client.address.zipcode}
          </dd>
        </div>
      </dl>

      <section aria-label={`Projects for ${client.name}`}>
        <h3 className={styles.projectsHeading}>
          Projects
          {projects.status === 'success' && (
            <span className={styles.projectsCount}>{projects.data.length}</span>
          )}
        </h3>

        {projects.status === 'loading' && (
          <p className={styles.stateMessage}>Loading projects…</p>
        )}

        {projects.status === 'error' && (
          <div className={styles.stateMessage} role="alert">
            <p>Could not load projects: {projects.error}</p>
            <button className={styles.retryButton} onClick={projects.retry}>
              Try again
            </button>
          </div>
        )}

        {projects.status === 'success' && (
          <ul className={styles.projectList}>
            {projects.data.map((project) => (
              <li key={project.id} className={styles.projectItem}>
                <p className={styles.projectTitle}>{project.title}</p>
                <p className={styles.projectBody}>{project.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Modal>
  );
}
