// src/components/IconAction.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography } from '../styles/theme';

interface IconActionProps {
  iconName: string;
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

const IconAction: React.FC<IconActionProps> = ({ iconName, label, onPress, isActive }) => {
  const color = isActive ? colors.primary : colors.darkGray;

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
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default IconAction;

