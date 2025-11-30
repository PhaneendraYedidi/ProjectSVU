import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { lightColors, spacing, typography, darkColors } from '../styles/theme';
import { ThemeContext } from '../context/ThemeContext';

interface IconActionProps {
  iconName: string;
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

const IconAction: React.FC<IconActionProps> = ({ iconName, label, onPress, isActive }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const colors = isDarkMode ? darkColors : lightColors;
  const color = isActive ? colors.primary : colors.textSecondary;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name={iconName} size={30} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default IconAction;