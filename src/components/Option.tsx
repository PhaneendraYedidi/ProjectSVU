import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { lightColors, spacing, typography, darkColors } from '../styles/theme';
import { ThemeContext } from '../context/ThemeContext';

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
  const { isDarkMode } = useContext(ThemeContext);
  const colors = isDarkMode ? darkColors : lightColors;
  const getBackgroundColor = () => {
    if (isRevealed) {
      return isCorrect ? colors.success : (isSelected ? colors.error : colors.surface);
    }
    return isSelected ? colors.primary : colors.surface;
  };

  const getTextColor = () => {
    if (isRevealed) {
      return isCorrect || isSelected ? colors.surface : colors.textPrimary;
    }
    return isSelected ? colors.surface : colors.textPrimary;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: getBackgroundColor(), borderColor: colors.border }]}
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
  },
  text: {
    ...typography.body,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Option;