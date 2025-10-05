export async function api(path: string, init?: RequestInit) {
  const res = await fetch(`http://localhost:4000${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    credentials: 'include',
    ...init
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
