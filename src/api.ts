const API_BASE = 'https://jsonplaceholder.typicode.com';

export const clientsUrl = `${API_BASE}/users`;

export function projectsUrl(clientId: number): string {
  return `${API_BASE}/posts?userId=${clientId}`;
}
