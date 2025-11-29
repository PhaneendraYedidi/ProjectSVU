// src/components/ExplanationView.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, spacing, typography } from '../styles/theme';

interface ExplanationViewProps {
  explanation: string;
}

const ExplanationView: React.FC<ExplanationViewProps> = ({ explanation }) => {
  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Explanation</Text>
        <Text style={styles.explanationText}>{explanation}</Text>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: '#FFFFFF',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  explanationText: {
    ...typography.body,
    color: '#FFFFFF',
    textAlign: 'justify',
  },
});

export default ExplanationView;
