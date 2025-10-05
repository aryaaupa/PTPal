import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { ProgressRing } from '@vitalize/ui';

export function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (id) api(`/patients/${id}`).then(setPatient);
  }, [id]);

  if (!patient) return <div>Loading…</div>;
  const adherence = Math.min(1, (patient.sessions?.length ?? 0) / 7);

  return (
    <div>
      <h2>{patient.user?.name}</h2>
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <strong>Adherence</strong>
          <ProgressRing progress={adherence} />
        </div>
        <div>
          <strong>Pain trend</strong>
          <div>Latest: {patient.sessions?.at(-1)?.pain ?? '—'}</div>
        </div>
      </div>
      <h3>Notes</h3>
      <ul>
        {(patient.sessions ?? []).slice(-5).map((s: any) => (
          <li key={s.id}>{new Date(s.date).toLocaleString()} — pain {s.pain}</li>
        ))}
      </ul>
    </div>
  );
}
