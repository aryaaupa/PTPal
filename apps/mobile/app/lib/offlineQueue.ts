// Simple offline queue placeholder; replace with AsyncStorage + retry
export type Queued = { id: string; url: string; body: any };
const queue: Queued[] = [];

export function enqueue(url: string, body: any) {
  queue.push({ id: Math.random().toString(36).slice(2), url, body });
}

export function flush() {
  // Attempt to send queued items
  // In real app, use NetInfo and retries with backoff
  queue.length = 0;
}
