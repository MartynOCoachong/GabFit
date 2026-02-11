import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Plus, Edit3, Trash2, Users, Dumbbell, Calendar, ArrowLeft, Copy, Eye, EyeOff, FileText, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { usePrograms } from '@/contexts/ProgramContext';
import { Button } from '@/components/Button';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Program } from '@/types';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { isAdmin, switchRole } = useAuth();
  const { programs, publishedPrograms, draftPrograms, deleteProgram, duplicateProgram, toggleProgramStatus } = usePrograms();
  
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.accessDenied}>
          <Text style={styles.accessDeniedTitle}>Admin Access Required</Text>
          <Text style={styles.accessDeniedText}>
            You need admin privileges to access the coach dashboard.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleDeletePress = (program: Program) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setProgramToDelete(program);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (programToDelete) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      deleteProgram(programToDelete.id);
      setDeleteModalVisible(false);
      setProgramToDelete(null);
    }
  };

  const handleDuplicate = (programId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    duplicateProgram(programId);
  };

  const handleToggleStatus = (program: Program) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newStatus = program.status === 'published' ? 'draft' : 'published';
    toggleProgramStatus({ programId: program.id, status: newStatus });
  };

  const totalWorkouts = programs.reduce((acc, p) => 
    acc + p.weeks.reduce((wAcc, w) => wAcc + w.days.length, 0), 0
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              switchRole('user');
              router.back();
            }}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Coach Dashboard</Text>
            <Text style={styles.subtitle}>Manage your programs and content</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Dumbbell size={24} color={colors.primary} />
            <Text style={styles.statValue}>{programs.length}</Text>
            <Text style={styles.statLabel}>Total Programs</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircle size={24} color={colors.success} />
            <Text style={styles.statValue}>{publishedPrograms.length}</Text>
            <Text style={styles.statLabel}>Published</Text>
          </View>
          <View style={styles.statCard}>
            <FileText size={24} color={colors.warning} />
            <Text style={styles.statValue}>{draftPrograms.length}</Text>
            <Text style={styles.statLabel}>Drafts</Text>
          </View>
        </View>

        <View style={styles.secondaryStats}>
          <View style={styles.secondaryStatCard}>
            <Calendar size={20} color={colors.secondary} />
            <Text style={styles.secondaryStatValue}>{totalWorkouts}</Text>
            <Text style={styles.secondaryStatLabel}>Total Workouts</Text>
          </View>
          <View style={styles.secondaryStatCard}>
            <Users size={20} color={colors.accent} />
            <Text style={styles.secondaryStatValue}>—</Text>
            <Text style={styles.secondaryStatLabel}>Active Users</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Programs</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/admin/create-program')}
            >
              <Plus size={20} color={colors.textLight} />
              <Text style={styles.addButtonText}>New</Text>
            </TouchableOpacity>
          </View>

          {programs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No programs yet</Text>
              <Text style={styles.emptyText}>
                Create your first program to get started.
              </Text>
            </View>
          ) : (
            <View style={styles.programsList}>
              {programs.map((program) => (
                <View key={program.id} style={styles.programCard}>
                  <Image
                    source={{ uri: program.imageUrl }}
                    style={styles.programImage}
                    contentFit="cover"
                  />
                  <View style={styles.programContent}>
                    <View style={styles.programHeader}>
                      <Text style={styles.programTitle} numberOfLines={1}>
                        {program.title}
                      </Text>
                      <View style={[
                        styles.statusBadge,
                        program.status === 'published' ? styles.statusPublished : styles.statusDraft
                      ]}>
                        <Text style={[
                          styles.statusText,
                          program.status === 'published' ? styles.statusTextPublished : styles.statusTextDraft
                        ]}>
                          {program.status === 'published' ? 'Published' : 'Draft'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.programMeta}>
                      {program.durationWeeks} weeks • {program.difficulty}
                    </Text>
                    <Text style={styles.programDate}>
                      Updated {formatDate(program.updatedAt || program.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.programActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleToggleStatus(program)}
                    >
                      {program.status === 'published' ? (
                        <EyeOff size={16} color={colors.warning} />
                      ) : (
                        <Eye size={16} color={colors.success} />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDuplicate(program.id)}
                    >
                      <Copy size={16} color={colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => router.push(`/admin/edit-program/${program.id}`)}
                    >
                      <Edit3 size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeletePress(program)}
                    >
                      <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/admin/create-program')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLight }]}>
                <Plus size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Add New Program</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => {}}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.secondaryLight }]}>
                <Dumbbell size={24} color={colors.secondary} />
              </View>
              <Text style={styles.quickActionText}>Manage Programs</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <ConfirmModal
        visible={deleteModalVisible}
        title="Delete Program"
        message={`Are you sure you want to delete "${programToDelete?.title}"? This will remove all weeks, days, exercises, and associated data. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setProgramToDelete(null);
        }}
      />
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  title: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...shadows.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  secondaryStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  secondaryStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    ...shadows.small,
  },
  secondaryStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  secondaryStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textLight,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  programsList: {
    gap: 12,
  },
  programCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.small,
  },
  programImage: {
    width: '100%',
    height: 120,
  },
  programContent: {
    padding: 14,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPublished: {
    backgroundColor: `${colors.success}15`,
  },
  statusDraft: {
    backgroundColor: `${colors.warning}15`,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
  },
  statusTextPublished: {
    color: colors.success,
  },
  statusTextDraft: {
    color: colors.warning,
  },
  programMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  programDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  programActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: `${colors.error}10`,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...shadows.small,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 24,
  },
  accessDenied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  accessDeniedTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  accessDeniedText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
});
