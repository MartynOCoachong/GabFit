import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function HealthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'My Health',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="edit-profile" 
        options={{ 
          title: 'Edit Profile',
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="progress-photos" 
        options={{ 
          title: 'Progress Photos',
        }} 
      />
    </Stack>
  );
}
