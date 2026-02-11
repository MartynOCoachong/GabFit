import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Calendar, Zap } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { Program } from '@/types';

interface ProgramCardProps {
  program: Program;
  onPress?: () => void;
}

const difficultyColors = {
  Beginner: colors.secondary,
  Intermediate: colors.accent,
  Advanced: colors.primaryDark,
};

export function ProgramCard({ program, onPress }: ProgramCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: program.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors[program.difficulty] }]}>
            <Zap size={12} color={colors.textLight} />
            <Text style={styles.difficultyText}>{program.difficulty}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.title}>{program.title}</Text>
          <View style={styles.meta}>
            <Calendar size={14} color={colors.textLight} />
            <Text style={styles.metaText}>{program.durationWeeks} weeks</Text>
          </View>
          <View style={styles.categories}>
            {program.categories.slice(0, 3).map((cat, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
    ...shadows.medium,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  difficultyText: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: '600' as const,
  },
  footer: {
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.textLight,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: colors.textLight,
    fontSize: 13,
    opacity: 0.9,
  },
  categories: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  categoryTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: '500' as const,
  },
});
