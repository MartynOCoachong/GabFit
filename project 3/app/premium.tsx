import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Check, Crown, Dumbbell, ChefHat, Camera, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';

const features = [
  {
    icon: Dumbbell,
    title: 'Full Programs',
    description: 'Access all workout programs with detailed weekly schedules',
  },
  {
    icon: Camera,
    title: 'Progress Tracking',
    description: 'Track your workouts, weights, and body progress photos',
  },
  {
    icon: ChefHat,
    title: 'Nutrition Plans',
    description: 'Unlock premium recipes and meal planning (coming soon)',
  },
  {
    icon: Heart,
    title: 'My Health',
    description: 'Personal dashboard with stats, measurements, and history',
  },
];

export default function PremiumScreen() {
  const router = useRouter();
  const { upgradeToPremium, isPremium } = useAuth();

  const handleUpgrade = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    upgradeToPremium();
    router.back();
  };

  if (isPremium) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.alreadyPremium}>
          <View style={styles.crownContainer}>
            <Crown size={48} color={colors.accent} />
          </View>
          <Text style={styles.alreadyTitle}>You are Premium!</Text>
          <Text style={styles.alreadyText}>
            You already have access to all premium features.
          </Text>
          <Button title="Continue" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[colors.primaryLight, colors.background]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.crownContainer}>
              <Crown size={40} color={colors.accent} />
            </View>
            <Text style={styles.title}>Unlock Your{'\n'}Full Potential</Text>
            <Text style={styles.subtitle}>
              Get unlimited access to all programs, tracking features, and exclusive content.
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <feature.icon size={22} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
                <Check size={20} color={colors.success} />
              </View>
            ))}
          </View>

          <View style={styles.pricingCard}>
            <View style={styles.pricingBadge}>
              <Text style={styles.pricingBadgeText}>Most Popular</Text>
            </View>
            <Text style={styles.pricingTitle}>Premium Access</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceSymbol}>$</Text>
              <Text style={styles.priceValue}>9.99</Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
            <Text style={styles.pricingNote}>Cancel anytime</Text>
          </View>

          <Button
            title="Start Premium"
            onPress={handleUpgrade}
            size="large"
            style={styles.upgradeButton}
          />

          <TouchableOpacity onPress={() => router.back()} style={styles.laterButton}>
            <Text style={styles.laterText}>Maybe later</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...shadows.small,
  },
  content: {
    padding: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    ...shadows.small,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  pricingCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.medium,
  },
  pricingBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pricingBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textLight,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginTop: 8,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceSymbol: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: colors.text,
  },
  pricePeriod: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 10,
    marginLeft: 4,
  },
  pricingNote: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
  },
  upgradeButton: {
    marginBottom: 16,
  },
  laterButton: {
    alignItems: 'center',
    padding: 12,
  },
  laterText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  termsText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  alreadyPremium: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  alreadyTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  alreadyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
});
