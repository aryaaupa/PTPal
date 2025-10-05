import React, { useEffect, useRef, useState } from 'react';
import { Button, Input } from '@vitalize/ui';

export function Messages() {
  const [messages, setMessages] = useState<{ text: string }[]>([]);
  const [text, setText] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:4000/ws`);
    ws.current.onmessage = (ev) => setMessages((m) => [...m, JSON.parse(ev.data)]);
    return () => ws.current?.close();
  }, []);

  return (
    <div>
      <h2>Messages</h2>
      <div>
        {messages.map((m, i) => (
          <div key={i}>{m.text}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Input value={text} onChange={(e) => setText(e.currentTarget.value)} />
        <Button onClick={() => { ws.current?.send(JSON.stringify({ text })); setText(''); }}>Send</Button>
      </div>
    </div>
  );
}
