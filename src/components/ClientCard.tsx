import type { Client } from '../types';
import { getInitials } from '../utils';
import styles from './ClientCard.module.css';

interface ClientCardProps {
  client: Client;
  onSelect: (client: Client) => void;
}

export function ClientCard({ client, onSelect }: ClientCardProps) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onSelect(client)}
      aria-label={`View details for ${client.name}`}
    >
      <span className={styles.avatar} aria-hidden="true">
        {getInitials(client.name)}
      </span>
      <span className={styles.identity}>
        <span className={styles.name}>{client.name}</span>
        <span className={styles.company}>{client.company.name}</span>
      </span>
      <span className={styles.meta}>
        <span className={styles.metaItem}>{client.email}</span>
        <span className={styles.metaItem}>{client.address.city}</span>
      </span>
    </button>
  );
}
