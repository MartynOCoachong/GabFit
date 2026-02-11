import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Clock, Flame } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { Recipe } from '@/types';
import { PremiumBadge } from './PremiumBadge';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: recipe.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
      {recipe.isPremium && (
        <View style={styles.badgeContainer}>
          <PremiumBadge />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{recipe.title}</Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{recipe.prepTime} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Flame size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{recipe.calories} cal</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    width: 200,
    ...shadows.small,
  },
  image: {
    width: '100%',
    height: 120,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
