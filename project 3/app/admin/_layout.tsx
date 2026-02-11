import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function AdminLayout() {
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
          title: 'Coach Dashboard',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="create-program" 
        options={{ 
          title: 'Create Program',
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="edit-program/[id]" 
        options={{ 
          title: 'Edit Program',
        }} 
      />
    </Stack>
  );
}
