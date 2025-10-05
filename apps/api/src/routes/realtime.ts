import { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';

export function registerRealtime(app: FastifyInstance) {
  const clients = new Map<string, Set<WebSocket>>();

  app.get('/ws', { websocket: true }, (conn, req) => {
    const userId = (req as any).user?.sub || 'anon';
    const set = clients.get(userId) ?? new Set<WebSocket>();
    set.add(conn.socket);
    clients.set(userId, set);

    conn.socket.on('close', () => {
      set.delete(conn.socket);
      if (set.size === 0) clients.delete(userId);
    });
  });

  function broadcastTo(userId: string, payload: unknown) {
    const set = clients.get(userId);
    if (!set) return;
    for (const ws of set) {
      if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
    }
  }

  app.decorate('realtime', { broadcastTo });
}
