import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Plus, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { BodyProgress } from '@/types';

export default function ProgressPhotosScreen() {
  const { bodyProgress, saveBodyProgress, user } = useAuth();

  const handleAddPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photos to add progress photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newProgress: BodyProgress = {
        id: Date.now().toString(),
        userId: user?.id || '',
        photoUrl: result.assets[0].uri,
        date: new Date().toISOString(),
        weight: user?.weight,
      };
      saveBodyProgress(newProgress);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress Photos</Text>
        <Text style={styles.subtitle}>Track your visual transformation over time</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
        <View style={styles.addIconContainer}>
          <Plus size={28} color={colors.primary} />
        </View>
        <Text style={styles.addButtonText}>Add Progress Photo</Text>
        <Text style={styles.addButtonHint}>Take or upload a full-body photo</Text>
      </TouchableOpacity>

      {bodyProgress.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No photos yet</Text>
          <Text style={styles.emptyText}>
            Start documenting your journey by adding your first progress photo.
          </Text>
        </View>
      ) : (
        <View style={styles.photosGrid}>
          {bodyProgress
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((progress) => (
              <View key={progress.id} style={styles.photoCard}>
                <Image
                  source={{ uri: progress.photoUrl }}
                  style={styles.photo}
                  contentFit="cover"
                />
                <View style={styles.photoInfo}>
                  <View style={styles.dateRow}>
                    <Calendar size={14} color={colors.textSecondary} />
                    <Text style={styles.dateText}>{formatDate(progress.date)}</Text>
                  </View>
                  {progress.weight && (
                    <Text style={styles.weightText}>{progress.weight} kg</Text>
                  )}
                </View>
              </View>
            ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addButton: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  addIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  addButtonHint: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 24,
  },
  photoCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.small,
  },
  photo: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  photoInfo: {
    padding: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  weightText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
});
