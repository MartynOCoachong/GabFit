import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ProgramWeek } from '@/types';
import { DayCard } from './DayCard';

interface WeekAccordionProps {
  week: ProgramWeek;
  completedDays?: string[];
  onDayPress: (dayId: string) => void;
  defaultExpanded?: boolean;
}

export function WeekAccordion({ 
  week, 
  completedDays = [], 
  onDayPress,
  defaultExpanded = false,
}: WeekAccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const animatedHeight = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

  const toggleExpanded = () => {
    const toValue = expanded ? 0 : 1;
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setExpanded(!expanded);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const completedCount = week.days.filter(d => completedDays.includes(d.id)).length;
  const progress = week.days.length > 0 ? completedCount / week.days.length : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpanded} activeOpacity={0.8}>
        <View style={styles.weekInfo}>
          <Text style={styles.weekTitle}>Week {week.weekNumber}</Text>
          <Text style={styles.dayCount}>{week.days.length} training days</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <ChevronDown size={20} color={colors.textSecondary} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={styles.content}>
          <View style={styles.daysList}>
            {week.days.map(day => (
              <DayCard
                key={day.id}
                day={day}
                isCompleted={completedDays.includes(day.id)}
                onPress={() => onDayPress(day.id)}
              />
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  weekInfo: {
    flex: 1,
  },
  weekTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  dayCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressContainer: {
    width: 60,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  daysList: {
    gap: 10,
  },
});
