import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Dumbbell, Lock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { usePrograms } from '@/contexts/ProgramContext';
import { ProgramCard } from '@/components/ProgramCard';
import { Button } from '@/components/Button';

export default function ProgramsScreen() {
  const router = useRouter();
  const { isPremium } = useAuth();
  const { programs } = usePrograms();

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.lockedContainer}>
          <View style={styles.lockedIcon}>
            <Lock size={48} color={colors.primary} />
          </View>
          <Text style={styles.lockedTitle}>Premium Feature</Text>
          <Text style={styles.lockedDescription}>
            Unlock full workout programs designed by professional coaches to achieve your fitness goals.
          </Text>
          <Button
            title="Upgrade to Premium"
            onPress={() => router.push('/premium')}
            style={styles.upgradeButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Dumbbell size={24} color={colors.primary} />
          </View>
          <Text style={styles.title}>Your Programs</Text>
          <Text style={styles.subtitle}>
            Choose a program to start your transformation
          </Text>
        </View>

        <View style={styles.programsList}>
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onPress={() => router.push(`/(tabs)/programs/${program.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  programsList: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 24,
  },
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  lockedIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  lockedDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  upgradeButton: {
    width: '100%',
  },
});
