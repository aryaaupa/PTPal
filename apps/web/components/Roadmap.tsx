'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';

const celebrationSound = new Howl({ src: ['/sounds/celebration.mp3'] });

export default function Roadmap() {
  const [session, setSession] = useState<any>(null);
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    fetch('/api/patient/today-session').then(res => res.json()).then(setSession);
  }, []);

  const completeExercise = async (exerciseId: string) => {
    await fetch('/api/patient/complete-exercise', {
      method: 'POST',
      body: JSON.stringify({ sessionId: session.id, exerciseId, completedSets: 1 })
    });
    // Update UI
  };

  const completeSession = async () => {
    const res = await fetch('/api/patient/complete-session', {
      method: 'POST',
      body: JSON.stringify({ sessionId: session.id })
    });
    const data = await res.json();
    setXpGained(data.xp);
    celebrationSound.play();
    // Show koala watering animation
  };

  return (
    <div>
      <h2>Today's Roadmap</h2>
      {session?.exercises?.length ? (
        session.exercises.map((ex: any) => (
          <motion.div key={ex.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <video src={ex.videoUrl} controls />
            <button onClick={() => completeExercise(ex.id)}>Mark Complete</button>
          </motion.div>
        ))
      ) : (
        <p>No exercises today. Rest up!</p>
      )}
      <button onClick={completeSession}>Finish Session</button>
      {xpGained > 0 && <motion.div animate={{ scale: 1.2 }}>XP Gained: {xpGained}</motion.div>}
    </div>
  );
}