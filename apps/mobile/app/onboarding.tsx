import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

export default function Onboarding() {
  const [injury, setInjury] = useState('');
  const [side, setSide] = useState('right');
  const [pain, setPain] = useState('5');
  const [mobility, setMobility] = useState('moderate');

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: '700' }}>Welcome</Text>
      <Text>We’ll tailor your plan. Answers are private.</Text>
      <Text>Injury</Text>
      <TextInput placeholder="e.g., Ankle sprain" value={injury} onChangeText={setInjury} style={{ backgroundColor: 'white', padding: 12, borderRadius: 12 }} />
      <Text>Side</Text>
      <TextInput placeholder="left/right/bilateral" value={side} onChangeText={setSide} style={{ backgroundColor: 'white', padding: 12, borderRadius: 12 }} />
      <Text>Baseline pain (0-10)</Text>
      <TextInput keyboardType="numeric" value={pain} onChangeText={setPain} style={{ backgroundColor: 'white', padding: 12, borderRadius: 12 }} />
      <Text>Mobility</Text>
      <TextInput placeholder="low/moderate/high" value={mobility} onChangeText={setMobility} style={{ backgroundColor: 'white', padding: 12, borderRadius: 12 }} />
      <Pressable accessibilityRole="button" style={{ backgroundColor: '#0ea5b5', padding: 12, borderRadius: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Continue</Text>
      </Pressable>
    </View>
  );
}
