import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function Home() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: '700' }}>Today</Text>
      <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16 }}>
        <Text>Progress Ring • Streak • Next Exercise</Text>
      </View>
      <Pressable accessibilityRole="button" style={{ backgroundColor: '#0ea5b5', padding: 12, borderRadius: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Start Session</Text>
      </Pressable>
    </View>
  );
}
