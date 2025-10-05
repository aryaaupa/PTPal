import React from 'react';
import { View, Text } from 'react-native';

export default function Progress() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: '700' }}>Progress</Text>
      <Text>Weekly chart and milestones</Text>
    </View>
  );
}
