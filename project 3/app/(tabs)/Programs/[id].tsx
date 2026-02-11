import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Calendar, Zap, Target } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { usePrograms } from '@/contexts/ProgramContext';
import { useAuth } from '@/contexts/AuthContext';
import { WeekAccordion } from '@/components/WeekAccordion';


export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProgramById } = usePrograms();
  const { workoutLogs } = useAuth();
  const program = getProgramById(id || '');

  if (!program) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Program not found</Text>
      </View>
    );
  }

  const completedDays = workoutLogs
    .filter(log => log.programId === program.id)
    .map(log => log.dayId);

  const handleDayPress = (weekNumber: number, dayId: string) => {
    router.push({
      pathname: '/workout/[programId]/[weekNumber]/[dayId]',
      params: { programId: program.id, weekNumber: weekNumber.toString(), dayId },
    });
  };

  const difficultyColors = {
    Beginner: colors.secondary,
    Intermediate: colors.accent,
    Advanced: colors.primaryDark,
  };

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: program.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors[program.difficulty] }]}>
              <Zap size={14} color={colors.textLight} />
              <Text style={styles.difficultyText}>{program.difficulty}</Text>
            </View>
            <Text style={styles.heroTitle}>{program.title}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.statValue}>{program.durationWeeks}</Text>
              <Text style={styles.statLabel}>Weeks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Target size={20} color={colors.primary} />
              <Text style={styles.statValue}>{program.weeks.reduce((acc, w) => acc + w.days.length, 0)}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Program</Text>
            <Text style={styles.description}>{program.description}</Text>
          </View>

          <View style={styles.categories}>
            {program.categories.map((cat, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Schedule</Text>
            {program.weeks.map((week) => (
              <WeekAccordion
                key={week.weekNumber}
                week={week}
                completedDays={completedDays}
                onDayPress={(dayId) => handleDayPress(week.weekNumber, dayId)}
                defaultExpanded={week.weekNumber === 1}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroContainer: {
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 12,
  },
  difficultyText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.textLight,
  },
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...shadows.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.primaryDark,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
