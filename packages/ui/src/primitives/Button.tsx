import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost';
};

export function Button({ variant = 'primary', style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    borderRadius: 12,
    padding: '12px 16px',
    fontWeight: 600,
    transition: 'transform 80ms ease, box-shadow 120ms ease',
    outlineOffset: 2,
    cursor: 'pointer',
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--brand)', color: 'white', border: '1px solid var(--brand2)' },
    outline: { background: 'transparent', color: 'var(--text1)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--text1)', border: '1px solid transparent' },
  };
  return (
    <button
      {...props}
      style={{ ...base, ...(variants[variant] || {}), ...style }}
      onMouseDown={(e) => {
        props.onMouseDown?.(e);
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        props.onMouseUp?.(e);
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    />
  );
}
