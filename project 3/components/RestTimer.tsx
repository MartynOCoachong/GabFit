import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Timer } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface RestTimerProps {
  duration: number;
  onComplete: () => void;
}

export function RestTimer({ duration, onComplete }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onComplete, progressAnim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Timer size={48} color={colors.primary} />
      </View>
      <Text style={styles.label}>Rest Time</Text>
      <Text style={styles.time}>{formatTime(timeLeft)}</Text>
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>
      <Text style={styles.hint}>Take a moment to catch your breath</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  time: {
    fontSize: 64,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 32,
  },
  progressContainer: {
    width: '80%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  hint: {
    marginTop: 24,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
