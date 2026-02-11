import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { usePrograms } from '@/contexts/ProgramContext';
import { Program, ProgramWeek, WorkoutDay, Exercise, NoteTemplate, ProgramStatus } from '@/types';
import { Button } from '@/components/Button';

const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'] as const;
const CATEGORY_OPTIONS = ['Strength', 'Cardio', 'HIIT', 'Flexibility', 'Toning', 'Full Body', 'Lower Body', 'Upper Body', 'Core', 'Glutes'];

const defaultExercise: Exercise = {
  id: '',
  name: 'New Exercise',
  imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
  sets: 3,
  reps: 10,
  restTime: 45,
  instructions: 'Exercise instructions go here.',
};

const defaultNoteTemplates: NoteTemplate[] = [
  { id: 'weight', label: 'Weight Used (kg)', type: 'number', placeholder: 'Enter weight' },
  { id: 'notes', label: 'Notes', type: 'text', placeholder: 'How did it feel?' },
];

export default function CreateProgramScreen() {
  const router = useRouter();
  const { addProgram } = usePrograms();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=400&fit=crop');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [durationWeeks, setDurationWeeks] = useState('8');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<ProgramStatus>('draft');

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const generateWeeks = (numWeeks: number): ProgramWeek[] => {
    const weeks: ProgramWeek[] = [];
    for (let i = 1; i <= numWeeks; i++) {
      const days: WorkoutDay[] = [];
      for (let j = 1; j <= 4; j++) {
        days.push({
          id: `w${i}-d${j}`,
          dayNumber: j,
          title: `Day ${j} Workout`,
          thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop',
          exercises: [
            { ...defaultExercise, id: `w${i}-d${j}-ex1` },
            { ...defaultExercise, id: `w${i}-d${j}-ex2`, name: 'Exercise 2' },
            { ...defaultExercise, id: `w${i}-d${j}-ex3`, name: 'Exercise 3' },
          ],
          noteTemplates: defaultNoteTemplates,
        });
      }
      weeks.push({ weekNumber: i, days });
    }
    return weeks;
  };

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a program title.');
      return;
    }
    if (selectedCategories.length === 0) {
      Alert.alert('Required', 'Please select at least one category.');
      return;
    }

    const numWeeks = parseInt(durationWeeks) || 8;
    const program: Program = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || 'A comprehensive workout program.',
      imageUrl,
      difficulty,
      durationWeeks: numWeeks,
      categories: selectedCategories,
      weeks: generateWeeks(numWeeks),
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status,
    };

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addProgram(program);
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Create Program',
          headerRight: () => (
            <TouchableOpacity onPress={handleCreate}>
              <Text style={styles.createButton}>Create</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Program Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Strong & Sculpted"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what users will achieve..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cover Image URL</Text>
            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://..."
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (weeks)</Text>
            <TextInput
              style={styles.input}
              value={durationWeeks}
              onChangeText={setDurationWeeks}
              placeholder="8"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Difficulty Level</Text>
            <View style={styles.optionsRow}>
              {DIFFICULTY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    difficulty === option && styles.optionButtonActive
                  ]}
                  onPress={() => setDifficulty(option)}
                >
                  <Text style={[
                    styles.optionText,
                    difficulty === option && styles.optionTextActive
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  status === 'draft' && styles.optionButtonDraft
                ]}
                onPress={() => setStatus('draft')}
              >
                <Text style={[
                  styles.optionText,
                  status === 'draft' && styles.optionTextActive
                ]}>
                  Draft
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  status === 'published' && styles.optionButtonPublished
                ]}
                onPress={() => setStatus('published')}
              >
                <Text style={[
                  styles.optionText,
                  status === 'published' && styles.optionTextActive
                ]}>
                  Published
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categories *</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORY_OPTIONS.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) && styles.categoryChipActive
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  {selectedCategories.includes(category) && (
                    <Check size={14} color={colors.textLight} />
                  )}
                  <Text style={[
                    styles.categoryText,
                    selectedCategories.includes(category) && styles.categoryTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            After creating the program, you can edit each week and day to add specific exercises, videos, and instructions.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Create Program" onPress={handleCreate} />
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
  createButton: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionButtonDraft: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  optionButtonPublished: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
  },
  optionTextActive: {
    color: colors.textLight,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.textLight,
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: colors.secondaryLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
  },
});
