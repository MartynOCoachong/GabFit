import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Play, CheckCircle } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { WorkoutDay } from '@/types';

interface DayCardProps {
  day: WorkoutDay;
  isCompleted?: boolean;
  onPress: () => void;
}

export function DayCard({ day, isCompleted = false, onPress }: DayCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: day.thumbnailUrl }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.dayNumber}>Day {day.dayNumber}</Text>
          <Text style={styles.title} numberOfLines={1}>{day.title}</Text>
          <Text style={styles.exerciseCount}>{day.exercises.length} exercises</Text>
        </View>
        <View style={[styles.actionButton, isCompleted && styles.completedButton]}>
          {isCompleted ? (
            <CheckCircle size={20} color={colors.success} />
          ) : (
            <Play size={18} color={colors.textLight} fill={colors.textLight} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadows.small,
  },
  image: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  info: {
    flex: 1,
  },
  dayNumber: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  exerciseCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedButton: {
    backgroundColor: colors.secondaryLight,
  },
});
