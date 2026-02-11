import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { X, Play } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '@/constants/colors';
import { freePreviewExercises } from '@/mocks/programs';
import { Button } from '@/components/Button';
import { RestTimer } from '@/components/RestTimer';

type WorkoutState = 'exercise' | 'rest' | 'complete';

export default function PreviewWorkoutScreen() {
  const router = useRouter();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutState, setWorkoutState] = useState<WorkoutState>('exercise');

  const exercises = freePreviewExercises;
  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isLastExercise) {
      setWorkoutState('complete');
    } else {
      setWorkoutState('rest');
    }
  };

  const handleRestComplete = () => {
    setCurrentExerciseIndex(prev => prev + 1);
    setWorkoutState('exercise');
  };

  const handleClose = () => {
    router.back();
  };

  const handleUpgrade = () => {
    router.replace('/premium');
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

  if (workoutState === 'complete') {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.completeContainer}>
          <View style={styles.completeIcon}>
            <Text style={styles.completeEmoji}>🎉</Text>
          </View>
          <Text style={styles.completeTitle}>Preview Complete!</Text>
          <Text style={styles.completeSubtitle}>
            You have experienced a taste of our coaching. Ready for the full journey?
          </Text>
          <Button
            title="Unlock Full Programs"
            onPress={handleUpgrade}
            style={styles.upgradeButton}
          />
          <TouchableOpacity onPress={handleClose} style={styles.laterButton}>
            <Text style={styles.laterText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.progress}>
          {exercises.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.progressDot, 
                index <= currentExerciseIndex && styles.progressDotActive
              ]} 
            />
          ))}
        </View>
        <View style={{ width: 40 }} />
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
  progress: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
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
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  setsReps: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
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
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  setsRepsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
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
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  completeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  completeEmoji: {
    fontSize: 48,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  completeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  upgradeButton: {
    width: '100%',
    marginBottom: 16,
  },
  laterButton: {
    padding: 12,
  },
  laterText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
