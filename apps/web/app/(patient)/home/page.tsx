'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Roadmap from '@/components/Roadmap';

export default function PatientHome() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className="p-4">
      <h1>Welcome, {user?.email}!</h1>
      <Roadmap />
    </div>
  );
}