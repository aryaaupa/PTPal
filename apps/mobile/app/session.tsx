import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { evaluatePosture, countRep } from './cv/pose';

export default function Session() {
  const [reps, setReps] = useState(0);
  const [hints, setHints] = useState<{ message: string; confidence: number }[]>([]);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: '700' }}>Session</Text>
      <Text>Reps: {reps}</Text>
      <View style={{ gap: 8 }}>
        {hints.map((h, i) => (
          <Text key={i} accessibilityLiveRegion="polite">{h.message}</Text>
        ))}
      </View>
      <Pressable
        onPress={() => {
          const lm = [0];
          setHints(evaluatePosture(lm));
          const r = countRep(reps, lm);
          setReps(r.reps);
        }}
        accessibilityRole="button"
        style={{ backgroundColor: '#10b981', padding: 12, borderRadius: 12 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Simulate Frame</Text>
      </Pressable>
    </View>
  );
}
