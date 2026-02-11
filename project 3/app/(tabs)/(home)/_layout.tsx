import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function HomeLayout() {
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
          title: '',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="recipe/[id]" 
        options={{ 
          title: 'Recipe',
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}
