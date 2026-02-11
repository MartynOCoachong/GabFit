import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        presentation: 'fullScreenModal',
      }}
    >
      <Stack.Screen name="preview" />
      <Stack.Screen name="[programId]/[weekNumber]/[dayId]" />
    </Stack>
  );
}
