// src/components/Option.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';

interface OptionProps {
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  onPress: () => void;
}

const Option: React.FC<OptionProps> = ({
  text,
  isSelected,
  isCorrect,
  isRevealed,
  onPress,
}) => {
  const getBackgroundColor = () => {
    if (isRevealed) {
      return isCorrect ? colors.correct : (isSelected ? colors.incorrect : colors.lightGray);
    }
    return isSelected ? colors.primary : colors.lightGray;
  };

  const getTextColor = () => {
    if (isRevealed) {
      return isCorrect || isSelected ? '#FFFFFF' : colors.text;
    }
    return isSelected ? '#FFFFFF' : colors.text;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      onPress={onPress}
      disabled={isRevealed}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.mediumGray,
  },
  text: {
    ...typography.body,
  },
});

export default Option;
