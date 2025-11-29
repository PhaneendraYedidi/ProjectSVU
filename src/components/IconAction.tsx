// src/components/IconAction.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography } from '../styles/theme';

interface IconActionProps {
  iconName: string;
  label: string;
  onPress: () => void;
}

const IconAction: React.FC<IconActionProps> = ({ iconName, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name={iconName} size={30} color={colors.darkGray} />
      <Text style={styles.label}>{label}</Text>
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
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
});

export default IconAction;
