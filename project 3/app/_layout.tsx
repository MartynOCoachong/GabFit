import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProgramProvider } from "@/contexts/ProgramContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen 
        name="premium" 
        options={{ 
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
        }} 
      />
      <Stack.Screen 
        name="workout" 
        options={{ 
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
        }} 
      />
      <Stack.Screen 
        name="admin" 
        options={{ 
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <ProgramProvider>
            <RootLayoutNav />
          </ProgramProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
