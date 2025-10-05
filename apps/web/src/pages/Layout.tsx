import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Card } from '@vitalize/ui';

export function Layout() {
  const { pathname } = useLocation();
  const nav = [
    { to: '/', label: 'Patients' },
    { to: '/plans', label: 'Plans' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/messages', label: 'Messages' },
    { to: '/settings', label: 'Settings' }
  ];
  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh' }}>
      <header style={{ padding: 16, borderBottom: '1px solid var(--border)', background: 'var(--bg1)' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <strong>Vitalize PT</strong>
          <nav style={{ display: 'flex', gap: 12 }}>
            {nav.map((n) => (
              <Link key={n.to} to={n.to} aria-current={pathname === n.to ? 'page' : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main style={{ padding: 16 }}>
        <Card>
          <Outlet />
        </Card>
      </main>
    </div>
  );
}
