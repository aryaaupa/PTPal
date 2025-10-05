import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function Analytics() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api('/analytics/overview').then(setData); }, []);
  if (!data) return <div>Loading…</div>;
  return (
    <div>
      <h2>Analytics</h2>
      <div style={{ display: 'flex', gap: 24 }}>
        <div><strong>Patients</strong><div>{data.patientCount}</div></div>
        <div><strong>Sessions</strong><div>{data.sessionCount}</div></div>
      </div>
    </div>
  );
}
