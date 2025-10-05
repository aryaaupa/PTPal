import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@vitalize/ui';
import { api } from '../lib/api';

type PatientRow = { id: string; name: string; email: string; risk?: string };

export function Patients() {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<PatientRow[]>([]);

  useEffect(() => {
    api('/patients').then((res) => {
      const items = res.patients?.map((p: any) => ({ id: p.id, name: p.user.name, email: p.user.email })) ?? [];
      setRows(items);
    });
  }, []);

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.email.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h2>Patients</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Input placeholder="Search" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
        <Button variant="outline">Filters</Button>
      </div>
      <table role="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Email</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>
                <Link to={`/patients/${r.id}`}>Open</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
