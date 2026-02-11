import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Play, Sparkles, ChefHat, Lock, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { freePreviewExercises } from '@/mocks/programs';
import { freePreviewRecipes } from '@/mocks/recipes';
import { Button } from '@/components/Button';
import { RecipeCard } from '@/components/RecipeCard';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isPremium } = useAuth();
  

  const handleStartPreview = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/workout/preview');
  };

  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/premium');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{user?.name || 'Beautiful'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => router.push('/(tabs)/health')}
          >
            <Image
              source={{ uri: user?.profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {!isPremium && (
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <View style={styles.freeTag}>
                <Sparkles size={14} color={colors.accent} />
                <Text style={styles.freeTagText}>Free Preview</Text>
              </View>
              <Text style={styles.heroTitle}>Try Your First Workout</Text>
              <Text style={styles.heroSubtitle}>
                Experience our coaching style with this sample session
              </Text>
              <Button
                title="Start Free Workout"
                onPress={handleStartPreview}
                style={styles.heroButton}
              />
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&h=400&fit=crop' }}
              style={styles.heroImage}
              contentFit="cover"
            />
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Play size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Sample Exercises</Text>
            </View>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.exercisesList}
          >
            {freePreviewExercises.map((exercise, index) => (
              <TouchableOpacity 
                key={exercise.id} 
                style={styles.exerciseCard}
                onPress={handleStartPreview}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: exercise.imageUrl }}
                  style={styles.exerciseImage}
                  contentFit="cover"
                />
                <View style={styles.playOverlay}>
                  <View style={styles.playButton}>
                    <Play size={24} color={colors.textLight} fill={colors.textLight} />
                  </View>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps} reps
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <ChefHat size={20} color={colors.secondary} />
              <Text style={styles.sectionTitle}>Nutrition Preview</Text>
            </View>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesList}
          >
            {freePreviewRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe}
                onPress={() => router.push(`/(tabs)/(home)/recipe/${recipe.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {!isPremium && (
          <View style={styles.premiumCta}>
            <View style={styles.premiumContent}>
              <View style={styles.premiumIcon}>
                <Lock size={24} color={colors.accent} />
              </View>
              <Text style={styles.premiumTitle}>Unlock Your Full Potential</Text>
              <Text style={styles.premiumDescription}>
                Get access to full programs, progress tracking, nutrition plans, and personalized coaching.
              </Text>
              <View style={styles.premiumFeatures}>
                {['Full Programs', 'Progress Tracking', 'Nutrition Plans', 'My Health'].map((feature, i) => (
                  <View key={i} style={styles.featureItem}>
                    <View style={styles.featureCheck} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <Button
                title="Go Premium"
                onPress={handleUpgrade}
                style={styles.premiumButton}
              />
            </View>
          </View>
        )}

        {isPremium && (
          <TouchableOpacity 
            style={styles.quickAccess}
            onPress={() => router.push('/(tabs)/programs')}
            activeOpacity={0.9}
          >
            <View style={styles.quickAccessContent}>
              <Text style={styles.quickAccessTitle}>Continue Your Journey</Text>
              <Text style={styles.quickAccessSubtitle}>Pick up where you left off</Text>
            </View>
            <ArrowRight size={24} color={colors.primary} />
          </TouchableOpacity>
        )}

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
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  name: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.text,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  heroSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    flexDirection: 'row',
    ...shadows.medium,
  },
  heroContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  freeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 12,
  },
  freeTagText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.accent,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  heroImage: {
    width: 130,
    height: '100%',
    minHeight: 180,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  exercisesList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  exerciseCard: {
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.small,
  },
  exerciseImage: {
    width: '100%',
    height: 130,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 130,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    padding: 14,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  recipesList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  premiumCta: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.accentLight,
    ...shadows.medium,
  },
  premiumContent: {
    padding: 24,
    alignItems: 'center',
  },
  premiumIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  premiumFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureCheck: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  featureText: {
    fontSize: 13,
    color: colors.text,
  },
  premiumButton: {
    width: '100%',
  },
  quickAccess: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickAccessContent: {
    flex: 1,
  },
  quickAccessTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  quickAccessSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  bottomSpacing: {
    height: 20,
  },
});
