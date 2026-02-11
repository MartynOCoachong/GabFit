import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '@/constants/colors';
import { usePrograms } from '@/contexts/ProgramContext';
import { Program, Exercise, NoteTemplate, WorkoutDay } from '@/types';
import { Button } from '@/components/Button';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function EditProgramScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProgramById, updateProgram, toggleProgramStatus } = usePrograms();

  const [program, setProgram] = useState<Program | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'exercises' | 'notes'>('exercises');
  const [deleteExerciseModal, setDeleteExerciseModal] = useState<{ visible: boolean; exerciseId: string | null }>({
    visible: false,
    exerciseId: null,
  });
  const [deleteDayModal, setDeleteDayModal] = useState<{ visible: boolean; dayId: string | null }>({
    visible: false,
    dayId: null,
  });

  useEffect(() => {
    const p = getProgramById(id || '');
    if (p) {
      setProgram(p);
      if (p.weeks.length > 0 && p.weeks[0].days.length > 0) {
        setSelectedDay(p.weeks[0].days[0].id);
      }
    }
  }, [id, getProgramById]);

  if (!program) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Program not found</Text>
      </View>
    );
  }

  const currentWeek = program.weeks.find(w => w.weekNumber === selectedWeek);
  const currentDay = currentWeek?.days.find(d => d.id === selectedDay);

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateProgram({ ...program, updatedAt: new Date().toISOString() });
    Alert.alert('Saved', 'Program updated successfully.');
  };

  const handleToggleStatus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newStatus = program.status === 'published' ? 'draft' : 'published';
    toggleProgramStatus({ programId: program.id, status: newStatus });
    setProgram(prev => prev ? { ...prev, status: newStatus } : prev);
  };

  const updateExercise = (exerciseId: string, field: keyof Exercise, value: string | number) => {
    setProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(week => ({
          ...week,
          days: week.days.map(day => ({
            ...day,
            exercises: day.exercises.map(ex => 
              ex.id === exerciseId ? { ...ex, [field]: value } : ex
            ),
          })),
        })),
      };
    });
  };

  const updateDayField = (dayId: string, field: keyof WorkoutDay, value: string) => {
    setProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === dayId ? { ...day, [field]: value } : day
          ),
        })),
      };
    });
  };

  const addExercise = () => {
    if (!currentDay || currentDay.exercises.length >= 5) {
      Alert.alert('Limit Reached', 'Maximum 5 exercises per day.');
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: 'New Exercise',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
      sets: 3,
      reps: 10,
      restTime: 45,
      instructions: '',
    };

    setProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === selectedDay 
              ? { ...day, exercises: [...day.exercises, newExercise] }
              : day
          ),
        })),
      };
    });
  };

  const removeExercise = (exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(week => ({
          ...week,
          days: week.days.map(day => ({
            ...day,
            exercises: day.exercises.filter(ex => ex.id !== exerciseId),
          })),
        })),
      };
    });
    setDeleteExerciseModal({ visible: false, exerciseId: null });
  };

  const moveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    if (!currentDay) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const exercises = [...currentDay.exercises];
    const index = exercises.findIndex(ex => ex.id === exerciseId);
    
    if (direction === 'up' && index > 0) {
      [exercises[index], exercises[index - 1]] = [exercises[index - 1], exercises[index]];
    } else if (direction === 'down' && index < exercises.length - 1) {
      [exercises[index], exercises[index + 1]] = [exercises[index + 1], exercises[index]];
    }

    setProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === selectedDay ? { ...day, exercises } : day
          ),
        })),
      };
    });
  };

  const addDay = () => {
    if (!currentWeek) return;
    if (currentWeek.days.length >= 7) {
      Alert.alert('Limit Reached', 'Maximum 7 days per week.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newDayNumber = currentWeek.days.length + 1;
    const newDay: WorkoutDay = {
      id: `w${selectedWeek}-d${Date.now()}`,
      dayNumber: newDayNumber,
      title: `Day ${newDayNumber} Workout`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop',
      exercises: [],
      noteTemplates: [
        { id: 'weight', label: 'Weight Used (kg)', type: 'number', placeholder: 'Enter weight' },
        { id: 'notes', label: 'Notes', type: 'text', placeholder: 'How did it feel?' },
      ],
    };

    setProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(week => 
          week.weekNumber === selectedWeek 
            ? { ...week, days: [...week.days, newDay] }
            : week
        ),
      };
    });
    setSelectedDay(newDay.id);
  };

  const removeDay = (dayId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setProgram(prev => {
      if (!prev) return prev;
      const updatedWeeks = prev.weeks.map(week => {
        if (week.weekNumber === selectedWeek) {
          const filteredDays = week.days.filter(d => d.id !== dayId);
          return {
            ...week,
            days: filteredDays.map((day, idx) => ({ ...day, dayNumber: idx + 1 })),
          };
        }
        return week;
      });
      return { ...prev, weeks: updatedWeeks };
    });
    
    const remainingDays = currentWeek?.days.filter(d => d.id !== dayId) || [];
    if (remainingDays.length > 0) {
      setSelectedDay(remainingDays[0].id);
    } else {
      setSelectedDay(null);
    }
    setDeleteDayModal({ visible: false, dayId: null });
  };

  const updateNoteTemplate = (templateId: string, field: keyof NoteTemplate, value: string) => {
    setProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === selectedDay 
              ? {
                  ...day,
                  noteTemplates: day.noteTemplates.map(t => 
                    t.id === templateId ? { ...t, [field]: value } : t
                  ),
                }
              : day
          ),
        })),
      };
    });
  };

  const addNoteTemplate = () => {
    if (!currentDay) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newTemplate: NoteTemplate = {
      id: `note-${Date.now()}`,
      label: 'New Field',
      type: 'text',
      placeholder: '',
    };

    setProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === selectedDay 
              ? { ...day, noteTemplates: [...day.noteTemplates, newTemplate] }
              : day
          ),
        })),
      };
    });
  };

  const removeNoteTemplate = (templateId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === selectedDay 
              ? { ...day, noteTemplates: day.noteTemplates.filter(t => t.id !== templateId) }
              : day
          ),
        })),
      };
    });
  };

  const toggleNoteType = (templateId: string) => {
    setProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === selectedDay 
              ? {
                  ...day,
                  noteTemplates: day.noteTemplates.map(t => 
                    t.id === templateId 
                      ? { ...t, type: t.type === 'text' ? 'number' : 'text' }
                      : t
                  ),
                }
              : day
          ),
        })),
      };
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: program.title,
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleToggleStatus} style={styles.headerButton}>
                {program.status === 'published' ? (
                  <EyeOff size={20} color={colors.warning} />
                ) : (
                  <Eye size={20} color={colors.success} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                <Save size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      <View style={styles.container}>
        <View style={styles.statusBar}>
          <View style={[
            styles.statusIndicator,
            program.status === 'published' ? styles.statusPublished : styles.statusDraft
          ]}>
            <Text style={[
              styles.statusText,
              program.status === 'published' ? styles.statusTextPublished : styles.statusTextDraft
            ]}>
              {program.status === 'published' ? 'Published' : 'Draft'}
            </Text>
          </View>
          <Text style={styles.lastUpdated}>
            Last updated: {new Date(program.updatedAt || program.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.weekSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weeksScroll}>
            {program.weeks.map((week) => (
              <TouchableOpacity
                key={week.weekNumber}
                style={[
                  styles.weekTab,
                  selectedWeek === week.weekNumber && styles.weekTabActive
                ]}
                onPress={() => {
                  setSelectedWeek(week.weekNumber);
                  if (week.days.length > 0) {
                    setSelectedDay(week.days[0].id);
                  } else {
                    setSelectedDay(null);
                  }
                }}
              >
                <Text style={[
                  styles.weekTabText,
                  selectedWeek === week.weekNumber && styles.weekTabTextActive
                ]}>
                  Week {week.weekNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {currentWeek && (
          <View style={styles.daySelector}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
              {currentWeek.days.map((day) => (
                <TouchableOpacity
                  key={day.id}
                  style={[
                    styles.dayTab,
                    selectedDay === day.id && styles.dayTabActive
                  ]}
                  onPress={() => setSelectedDay(day.id)}
                  onLongPress={() => setDeleteDayModal({ visible: true, dayId: day.id })}
                >
                  <Text style={[
                    styles.dayTabText,
                    selectedDay === day.id && styles.dayTabTextActive
                  ]}>
                    Day {day.dayNumber}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addDayButton} onPress={addDay}>
                <Plus size={16} color={colors.primary} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {currentDay && (
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'details' && styles.tabActive]}
              onPress={() => setActiveTab('details')}
            >
              <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'exercises' && styles.tabActive]}
              onPress={() => setActiveTab('exercises')}
            >
              <Text style={[styles.tabText, activeTab === 'exercises' && styles.tabTextActive]}>Exercises</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'notes' && styles.tabActive]}
              onPress={() => setActiveTab('notes')}
            >
              <Text style={[styles.tabText, activeTab === 'notes' && styles.tabTextActive]}>Notes</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {!currentDay ? (
            <View style={styles.emptyDay}>
              <Text style={styles.emptyDayText}>No days in this week</Text>
              <Button title="Add Day" onPress={addDay} variant="outline" />
            </View>
          ) : activeTab === 'details' ? (
            <View style={styles.detailsTab}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Day Title</Text>
                <TextInput
                  style={styles.input}
                  value={currentDay.title}
                  onChangeText={(text) => updateDayField(currentDay.id, 'title', text)}
                  placeholder="Day title"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Thumbnail URL</Text>
                <TextInput
                  style={styles.input}
                  value={currentDay.thumbnailUrl}
                  onChangeText={(text) => updateDayField(currentDay.id, 'thumbnailUrl', text)}
                  placeholder="https://..."
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
          ) : activeTab === 'exercises' ? (
            <>
              <View style={styles.exerciseHeader}>
                <Text style={styles.sectionTitle}>
                  Exercises ({currentDay.exercises.length}/5)
                </Text>
                <TouchableOpacity 
                  style={styles.addExerciseButton}
                  onPress={addExercise}
                  disabled={currentDay.exercises.length >= 5}
                >
                  <Plus size={18} color={currentDay.exercises.length >= 5 ? colors.textMuted : colors.primary} />
                  <Text style={[
                    styles.addExerciseText,
                    currentDay.exercises.length >= 5 && styles.addExerciseTextDisabled
                  ]}>Add</Text>
                </TouchableOpacity>
              </View>

              {currentDay.exercises.length === 0 ? (
                <View style={styles.emptyExercises}>
                  <Text style={styles.emptyText}>No exercises yet</Text>
                  <Button title="Add Exercise" onPress={addExercise} variant="outline" />
                </View>
              ) : (
                currentDay.exercises.map((exercise, index) => (
                  <View key={exercise.id} style={styles.exerciseCard}>
                    <View style={styles.exerciseCardHeader}>
                      <Text style={styles.exerciseNumber}>Exercise {index + 1}</Text>
                      <View style={styles.exerciseActions}>
                        <TouchableOpacity
                          style={styles.moveButton}
                          onPress={() => moveExercise(exercise.id, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp size={18} color={index === 0 ? colors.textMuted : colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.moveButton}
                          onPress={() => moveExercise(exercise.id, 'down')}
                          disabled={index === currentDay.exercises.length - 1}
                        >
                          <ChevronDown size={18} color={index === currentDay.exercises.length - 1 ? colors.textMuted : colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteExerciseButton}
                          onPress={() => setDeleteExerciseModal({ visible: true, exerciseId: exercise.id })}
                        >
                          <Trash2 size={16} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.inputRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.smallLabel}>Name</Text>
                        <TextInput
                          style={styles.smallInput}
                          value={exercise.name}
                          onChangeText={(text) => updateExercise(exercise.id, 'name', text)}
                          placeholder="Exercise name"
                          placeholderTextColor={colors.textMuted}
                        />
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.smallLabel}>Video URL (optional)</Text>
                        <TextInput
                          style={styles.smallInput}
                          value={exercise.videoUrl || ''}
                          onChangeText={(text) => updateExercise(exercise.id, 'videoUrl', text)}
                          placeholder="https://..."
                          placeholderTextColor={colors.textMuted}
                        />
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.smallLabel}>Image URL</Text>
                        <TextInput
                          style={styles.smallInput}
                          value={exercise.imageUrl}
                          onChangeText={(text) => updateExercise(exercise.id, 'imageUrl', text)}
                          placeholder="https://..."
                          placeholderTextColor={colors.textMuted}
                        />
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.smallLabel}>Sets</Text>
                        <TextInput
                          style={styles.smallInput}
                          value={exercise.sets.toString()}
                          onChangeText={(text) => updateExercise(exercise.id, 'sets', parseInt(text) || 0)}
                          keyboardType="numeric"
                          placeholderTextColor={colors.textMuted}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.smallLabel}>Reps</Text>
                        <TextInput
                          style={styles.smallInput}
                          value={exercise.reps.toString()}
                          onChangeText={(text) => updateExercise(exercise.id, 'reps', parseInt(text) || 0)}
                          keyboardType="numeric"
                          placeholderTextColor={colors.textMuted}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.smallLabel}>Rest (s)</Text>
                        <TextInput
                          style={styles.smallInput}
                          value={exercise.restTime.toString()}
                          onChangeText={(text) => updateExercise(exercise.id, 'restTime', parseInt(text) || 0)}
                          keyboardType="numeric"
                          placeholderTextColor={colors.textMuted}
                        />
                      </View>
                    </View>

                    <Text style={styles.smallLabel}>Instructions</Text>
                    <TextInput
                      style={[styles.smallInput, { minHeight: 80, textAlignVertical: 'top' }]}
                      value={exercise.instructions}
                      onChangeText={(text) => updateExercise(exercise.id, 'instructions', text)}
                      placeholder="Exercise instructions..."
                      placeholderTextColor={colors.textMuted}
                      multiline
                    />
                  </View>
                ))
              )}
            </>
          ) : (
            <>
              <View style={styles.exerciseHeader}>
                <Text style={styles.sectionTitle}>Notes Template</Text>
                <TouchableOpacity style={styles.addExerciseButton} onPress={addNoteTemplate}>
                  <Plus size={18} color={colors.primary} />
                  <Text style={styles.addExerciseText}>Add Field</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.notesDescription}>
                Define the fields users see when completing this workout.
              </Text>

              {currentDay.noteTemplates.length === 0 ? (
                <View style={styles.emptyExercises}>
                  <Text style={styles.emptyText}>No note fields defined</Text>
                  <Button title="Add Field" onPress={addNoteTemplate} variant="outline" />
                </View>
              ) : (
                currentDay.noteTemplates.map((template) => (
                  <View key={template.id} style={styles.noteTemplateCard}>
                    <View style={styles.noteTemplateHeader}>
                      <TouchableOpacity
                        style={[
                          styles.typeToggle,
                          template.type === 'number' && styles.typeToggleNumber
                        ]}
                        onPress={() => toggleNoteType(template.id)}
                      >
                        <Text style={styles.typeToggleText}>
                          {template.type === 'number' ? '123' : 'ABC'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteNoteButton}
                        onPress={() => removeNoteTemplate(template.id)}
                      >
                        <Trash2 size={16} color={colors.error} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.smallLabel}>Field Label</Text>
                      <TextInput
                        style={styles.smallInput}
                        value={template.label}
                        onChangeText={(text) => updateNoteTemplate(template.id, 'label', text)}
                        placeholder="e.g., Weight Used"
                        placeholderTextColor={colors.textMuted}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.smallLabel}>Placeholder Text</Text>
                      <TextInput
                        style={styles.smallInput}
                        value={template.placeholder || ''}
                        onChangeText={(text) => updateNoteTemplate(template.id, 'placeholder', text)}
                        placeholder="e.g., Enter weight in kg"
                        placeholderTextColor={colors.textMuted}
                      />
                    </View>
                  </View>
                ))
              )}
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button title="Save Changes" onPress={handleSave} />
          </View>
        </ScrollView>
      </View>

      <ConfirmModal
        visible={deleteExerciseModal.visible}
        title="Delete Exercise"
        message="Are you sure you want to remove this exercise?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => deleteExerciseModal.exerciseId && removeExercise(deleteExerciseModal.exerciseId)}
        onCancel={() => setDeleteExerciseModal({ visible: false, exerciseId: null })}
      />

      <ConfirmModal
        visible={deleteDayModal.visible}
        title="Delete Day"
        message="Are you sure you want to remove this day and all its exercises?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => deleteDayModal.dayId && removeDay(deleteDayModal.dayId)}
        onCancel={() => setDeleteDayModal({ visible: false, dayId: null })}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusIndicator: {
    paddingHorizontal: 10,
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
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
  },
  statusTextPublished: {
    color: colors.success,
  },
  statusTextDraft: {
    color: colors.warning,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textMuted,
  },
  weekSelector: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  weeksScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  weekTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    marginRight: 8,
  },
  weekTabActive: {
    backgroundColor: colors.primary,
  },
  weekTabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  weekTabTextActive: {
    color: colors.textLight,
  },
  daySelector: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  daysScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  dayTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    marginRight: 8,
  },
  dayTabActive: {
    backgroundColor: colors.secondary,
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  dayTabTextActive: {
    color: colors.textLight,
  },
  addDayButton: {
    width: 32,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  detailsTab: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
  },
  addExerciseText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  addExerciseTextDisabled: {
    color: colors.textMuted,
  },
  emptyDay: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyDayText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  emptyExercises: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...shadows.small,
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moveButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteExerciseButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: `${colors.error}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  smallLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  smallInput: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  notesDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  noteTemplateCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
  },
  noteTemplateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.secondaryLight,
  },
  typeToggleNumber: {
    backgroundColor: colors.primaryLight,
  },
  typeToggleText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.text,
  },
  deleteNoteButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: `${colors.error}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
