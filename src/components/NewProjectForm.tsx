import { useState, type FormEvent } from 'react';
import { todayIsoDate } from '../utils';
import { Modal } from './Modal';
import type { Client } from '../types';
import styles from './NewProjectForm.module.css';

export interface NewProjectValues {
  clientId: number;
  title: string;
  deadline: string;
}

interface NewProjectFormProps {
  clients: Client[];
  onSubmit: (values: NewProjectValues) => void;
  onClose: () => void;
}

interface FormErrors {
  clientId?: string;
  title?: string;
  deadline?: string;
}

function validate(clientId: string, title: string, deadline: string): FormErrors {
  const errors: FormErrors = {};

  if (clientId === '') {
    errors.clientId = 'Please select a client.';
  }

  if (title.trim() === '') {
    errors.title = 'Project title is required.';
  }

  if (deadline === '') {
    errors.deadline = 'Deadline is required.';
  } else if (deadline < todayIsoDate()) {
    errors.deadline = 'Deadline cannot be in the past.';
  }

  return errors;
}

export function NewProjectForm({ clients, onSubmit, onClose }: NewProjectFormProps) {
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(clientId, title, deadline);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      clientId: Number(clientId),
      title: title.trim(),
      deadline,
    });
  };

  return (
    <Modal title="New Project" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="project-client">
            Client
          </label>
          <select
            id="project-client"
            className={styles.input}
            value={clientId}
            onChange={(event) => {
              setClientId(event.target.value);
              setErrors((prev) => ({ ...prev, clientId: undefined }));
            }}
            aria-invalid={errors.clientId !== undefined}
            aria-describedby={errors.clientId ? 'project-client-error' : undefined}
          >
            <option value="">Select a client…</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.company.name})
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p id="project-client-error" className={styles.error}>
              {errors.clientId}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="project-title">
            Project title
          </label>
          <input
            id="project-title"
            type="text"
            className={styles.input}
            placeholder="e.g. Marketing site redesign"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            aria-invalid={errors.title !== undefined}
            aria-describedby={errors.title ? 'project-title-error' : undefined}
          />
          {errors.title && (
            <p id="project-title-error" className={styles.error}>
              {errors.title}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="project-deadline">
            Deadline
          </label>
          <input
            id="project-deadline"
            type="date"
            className={styles.input}
            min={todayIsoDate()}
            value={deadline}
            onChange={(event) => {
              setDeadline(event.target.value);
              setErrors((prev) => ({ ...prev, deadline: undefined }));
            }}
            aria-invalid={errors.deadline !== undefined}
            aria-describedby={errors.deadline ? 'project-deadline-error' : undefined}
          />
          {errors.deadline && (
            <p id="project-deadline-error" className={styles.error}>
              {errors.deadline}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryButton}>
            Add project
          </button>
        </div>
      </form>
    </Modal>
  );
}
