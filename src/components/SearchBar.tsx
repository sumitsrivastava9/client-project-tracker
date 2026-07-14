import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      className={styles.input}
      placeholder="Search by name or company…"
      aria-label="Search clients by name or company"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
