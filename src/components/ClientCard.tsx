import type { Client } from '../types';
import { getInitials } from '../utils';
import styles from './ClientCard.module.css';

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.avatar} aria-hidden="true">
        {getInitials(client.name)}
      </span>
      <div className={styles.identity}>
        <h2 className={styles.name}>{client.name}</h2>
        <p className={styles.company}>{client.company.name}</p>
      </div>
      <div className={styles.meta}>
        <p className={styles.metaItem}>{client.email}</p>
        <p className={styles.metaItem}>{client.address.city}</p>
      </div>
    </article>
  );
}
