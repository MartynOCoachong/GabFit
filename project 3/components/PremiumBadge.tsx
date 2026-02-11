import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Crown } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface PremiumBadgeProps {
  size?: 'small' | 'medium';
}

export function PremiumBadge({ size = 'small' }: PremiumBadgeProps) {
  return (
    <View style={[styles.badge, size === 'medium' && styles.badgeMedium]}>
      <Crown size={size === 'small' ? 10 : 14} color={colors.accent} />
      <Text style={[styles.text, size === 'medium' && styles.textMedium]}>Premium</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: colors.accent,
  },
  textMedium: {
    fontSize: 12,
  },
});
