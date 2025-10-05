import React from 'react';

export function Card({ children, style, ...props }: React.PropsWithChildren<{ style?: React.CSSProperties } & React.HTMLAttributes<HTMLDivElement>>) {
  const base: React.CSSProperties = {
    background: 'var(--bg1)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    padding: 16,
  };
  return (
    <div {...props} style={{ ...base, ...style }}>
      {children}
    </div>
  );
}
