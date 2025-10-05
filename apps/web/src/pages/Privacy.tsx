import React from 'react';

export function Privacy() {
  return (
    <div>
      <h2>Privacy Summary</h2>
      <ul>
        <li>No camera frames leave the device. Only derived metrics (rep counts and event times) are stored.</li>
        <li>Data encrypted in transit (TLS) and at rest (database encryption support).</li>
        <li>Role-based access control separates patient, clinician, and admin permissions.</li>
        <li>Audit logs for clinical actions (assign plans, adjust dosage, export outcomes).</li>
        <li>Export your data anytime from settings.</li>
      </ul>
    </div>
  );
}
