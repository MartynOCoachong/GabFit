import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { X, Play } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '@/constants/colors';
import { usePrograms } from '@/contexts/ProgramContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { RestTimer } from '@/components/RestTimer';
import { WorkoutNotes } from '@/components/WorkoutNotes';
import { WorkoutLog } from '@/types';

type WorkoutState = 'exercise' | 'rest' | 'notes';

export default function WorkoutScreen() {
  const router = useRouter();
  const { programId, weekNumber, dayId } = useLocalSearchParams<{
    programId: string;
    weekNumber: string;
    dayId: string;
  }>();
  const { getProgramById } = usePrograms();
  const { user, saveWorkoutLog } = useAuth();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutState, setWorkoutState] = useState<WorkoutState>('exercise');

  const program = getProgramById(programId || '');
  const week = program?.weeks.find(w => w.weekNumber === parseInt(weekNumber || '1'));
  const day = week?.days.find(d => d.id === dayId);

  if (!program || !week || !day) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Workout not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const exercises = day.exercises;
  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isLastExercise) {
      setWorkoutState('notes');
    } else {
      setWorkoutState('rest');
    }
  };

  const handleRestComplete = () => {
    setCurrentExerciseIndex(prev => prev + 1);
    setWorkoutState('exercise');
  };

  const handleComplete = (notes: Record<string, string | number>) => {
    const log: WorkoutLog = {
      id: Date.now().toString(),
      userId: user?.id || '',
      programId: program.id,
      weekNumber: week.weekNumber,
      dayId: day.id,
      completedAt: new Date().toISOString(),
      notes,
      exercises: exercises.map(e => ({
        exerciseId: e.id,
        completed: true,
      })),
    };
    saveWorkoutLog(log);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  if (workoutState === 'rest') {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <RestTimer duration={currentExercise.restTime} onComplete={handleRestComplete} />
      </SafeAreaView>
    );
  }

  if (workoutState === 'notes') {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.closeButtonNotes} onPress={handleClose}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <WorkoutNotes templates={day.noteTemplates} onComplete={handleComplete} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.dayTitle}>{day.title}</Text>
          <Text style={styles.exerciseCount}>
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progress}>
        {exercises.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressSegment, 
              index <= currentExerciseIndex && styles.progressSegmentActive
            ]} 
          />
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.exerciseImageContainer}>
          <Image
            source={{ uri: currentExercise.imageUrl }}
            style={styles.exerciseImage}
            contentFit="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Play size={32} color={colors.textLight} fill={colors.textLight} />
            </View>
          </View>
        </View>

        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          
          <View style={styles.setsReps}>
            <View style={styles.setsRepsItem}>
              <Text style={styles.setsRepsValue}>{currentExercise.sets}</Text>
              <Text style={styles.setsRepsLabel}>Sets</Text>
            </View>
            <View style={styles.setsRepsDivider} />
            <View style={styles.setsRepsItem}>
              <Text style={styles.setsRepsValue}>{currentExercise.reps}</Text>
              <Text style={styles.setsRepsLabel}>Reps</Text>
            </View>
            <View style={styles.setsRepsDivider} />
            <View style={styles.setsRepsItem}>
              <Text style={styles.setsRepsValue}>{currentExercise.restTime}s</Text>
              <Text style={styles.setsRepsLabel}>Rest</Text>
            </View>
          </View>

          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            <Text style={styles.instructionsText}>{currentExercise.instructions}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isLastExercise ? "Complete Workout" : "Next Exercise"}
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  closeButtonNotes: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...shadows.small,
  },
  headerCenter: {
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  exerciseCount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progress: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 4,
    marginBottom: 16,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  progressSegmentActive: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  exerciseImageContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.medium,
  },
  exerciseImage: {
    width: '100%',
    height: 240,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    padding: 20,
  },
  exerciseName: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  setsReps: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    ...shadows.small,
  },
  setsRepsItem: {
    flex: 1,
    alignItems: 'center',
  },
  setsRepsDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  setsRepsValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  setsRepsLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  instructionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    ...shadows.small,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 8,
  },
  nextButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
});
