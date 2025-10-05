import React, { useEffect, useState } from 'react';

type ToastProps = { message: string; duration?: number };

export function Toast({ message, duration = 2500 }: ToastProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(id);
  }, [duration]);
  if (!visible) return null;
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'var(--text1)', color: 'white', padding: '10px 14px', borderRadius: 12 }}>
      {message}
    </div>
  );
}
