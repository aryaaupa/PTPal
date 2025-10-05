import React from 'react';

type ModalProps = React.PropsWithChildren<{ open: boolean; onClose: () => void; title?: string }>;

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'grid', placeItems: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, minWidth: 320 }} onClick={(e) => e.stopPropagation()}>
        {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
