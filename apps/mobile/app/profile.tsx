import React from 'react';
import { View, Text } from 'react-native';

export default function Profile() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: '700' }}>Profile</Text>
      <Text>Settings, permissions, reminders, privacy</Text>
    </View>
  );
}
