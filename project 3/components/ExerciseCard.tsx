import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
  compact?: boolean;
}

export function ExerciseCard({ exercise, onPress, compact = false }: ExerciseCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: exercise.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.playOverlay}>
          <Play size={24} color={colors.textLight} fill={colors.textLight} />
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{exercise.name}</Text>
        <Text style={styles.details}>
          {exercise.sets} sets × {exercise.reps} reps
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.small,
  },
  cardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
