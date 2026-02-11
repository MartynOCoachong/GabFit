import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { NoteTemplate } from '@/types';
import { Button } from './Button';

interface WorkoutNotesProps {
  templates: NoteTemplate[];
  onComplete: (notes: Record<string, string | number>) => void;
}

export function WorkoutNotes({ templates, onComplete }: WorkoutNotesProps) {
  const [notes, setNotes] = useState<Record<string, string | number>>({});

  const handleChange = (id: string, value: string, type: 'number' | 'text') => {
    setNotes(prev => ({
      ...prev,
      [id]: type === 'number' ? (value ? parseFloat(value) : '') : value,
    }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconContainer}>
        <CheckCircle size={64} color={colors.success} />
      </View>
      <Text style={styles.title}>Workout Complete!</Text>
      <Text style={styles.subtitle}>Great job! Log your progress below.</Text>

      <View style={styles.form}>
        {templates.map(template => (
          <View key={template.id} style={styles.inputContainer}>
            <Text style={styles.label}>{template.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={template.placeholder}
              placeholderTextColor={colors.textMuted}
              keyboardType={template.type === 'number' ? 'numeric' : 'default'}
              multiline={template.type === 'text'}
              numberOfLines={template.type === 'text' ? 3 : 1}
              value={notes[template.id]?.toString() || ''}
              onChangeText={value => handleChange(template.id, value, template.type)}
            />
          </View>
        ))}
      </View>

      <Button
        title="Save & Finish"
        onPress={() => onComplete(notes)}
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  form: {
    width: '100%',
    gap: 20,
  },
  inputContainer: {
    width: '100%',
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
  button: {
    width: '100%',
    marginTop: 32,
  },
});
