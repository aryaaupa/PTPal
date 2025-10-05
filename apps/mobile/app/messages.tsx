import React from 'react';
import { View, Text } from 'react-native';

export default function Messages() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: '700' }}>Messages</Text>
      <Text>Clinician chat and check-ins</Text>
    </View>
  );
}
