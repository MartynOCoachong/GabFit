import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  User, Settings, Camera, TrendingUp, Calendar, 
  Lock, ChevronRight, Shield, Crown 
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';

export default function HealthScreen() {
  const router = useRouter();
  const { user, isPremium, workoutLogs, isAdmin, switchRole } = useAuth();

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.lockedContainer}>
          <View style={styles.lockedIcon}>
            <Lock size={48} color={colors.primary} />
          </View>
          <Text style={styles.lockedTitle}>My Health</Text>
          <Text style={styles.lockedDescription}>
            Track your progress, store body measurements, and view your fitness journey over time.
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

  const totalWorkouts = workoutLogs.length;
  const thisWeekWorkouts = workoutLogs.filter(log => {
    const logDate = new Date(log.completedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  }).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Health</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/(tabs)/health/edit-profile')}
          >
            <Settings size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' }}
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => router.push('/(tabs)/health/edit-profile')}
            >
              <Camera size={16} color={colors.textLight} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Crown size={14} color={colors.accent} />
              <Text style={styles.premiumText}>Premium Member</Text>
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={colors.primary} />
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color={colors.secondary} />
            <Text style={styles.statValue}>{thisWeekWorkouts}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.bodyStatItem}>
              <Text style={styles.bodyStatValue}>{user?.height || '—'}</Text>
              <Text style={styles.bodyStatLabel}>Height (cm)</Text>
            </View>
            <View style={styles.bodyStatDivider} />
            <View style={styles.bodyStatItem}>
              <Text style={styles.bodyStatValue}>{user?.weight || '—'}</Text>
              <Text style={styles.bodyStatLabel}>Weight (kg)</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/health/progress-photos')}
          >
            <View style={styles.menuIcon}>
              <Camera size={20} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Progress Photos</Text>
              <Text style={styles.menuSubtitle}>Track your visual progress</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/health/edit-profile')}
          >
            <View style={styles.menuIcon}>
              <User size={20} color={colors.secondary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Edit Profile</Text>
              <Text style={styles.menuSubtitle}>Update your information</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => switchRole(isAdmin ? 'user' : 'admin')}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.accentLight }]}>
              <Shield size={20} color={colors.accent} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                {isAdmin ? 'Switch to User Mode' : 'Switch to Admin Mode'}
              </Text>
              <Text style={styles.menuSubtitle}>
                {isAdmin ? 'View app as a regular user' : 'Access coach dashboard'}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...shadows.small,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    ...shadows.small,
  },
  bodyStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  bodyStatDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  bodyStatValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  bodyStatLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    ...shadows.small,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  bottomSpacing: {
    height: 24,
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
