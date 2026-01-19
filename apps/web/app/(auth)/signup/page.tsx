'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!error) {
      if (role === 'pt') await supabase.from('pt_profiles').insert({ user_id: data.user.id });
      else await supabase.from('patients').insert({ user_id: data.user.id });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="patient">Patient</option>
        <option value="pt">PT</option>
      </select>
      <Button onClick={handleSignup}>Sign Up</Button>
    </div>
  );
}