import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { User, UserRole, WorkoutLog, BodyProgress } from '@/types';

const STORAGE_KEYS = {
  USER: 'user_data',
  WORKOUT_LOGS: 'workout_logs',
  BODY_PROGRESS: 'body_progress',
};

const defaultUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Sarah',
  role: 'user',
  isPremium: false,
  createdAt: new Date().toISOString(),
};

export const [AuthProvider, useAuth] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        return JSON.parse(stored) as User;
      }
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
      return defaultUser;
    },
  });

  const workoutLogsQuery = useQuery({
    queryKey: ['workoutLogs'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
      return stored ? (JSON.parse(stored) as WorkoutLog[]) : [];
    },
  });

  const bodyProgressQuery = useQuery({
    queryKey: ['bodyProgress'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.BODY_PROGRESS);
      return stored ? (JSON.parse(stored) as BodyProgress[]) : [];
    },
  });

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
      setIsLoading(false);
    }
  }, [userQuery.data]);

  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const updatedUser = { ...user, ...updates } as User;
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const upgradeToPremium = () => {
    updateUserMutation.mutate({ isPremium: true });
  };

  const switchRole = (role: UserRole) => {
    updateUserMutation.mutate({ role });
  };

  const saveWorkoutLogMutation = useMutation({
    mutationFn: async (log: WorkoutLog) => {
      const currentLogs = workoutLogsQuery.data || [];
      const updatedLogs = [...currentLogs, log];
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(updatedLogs));
      return updatedLogs;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutLogs'] });
    },
  });

  const saveBodyProgressMutation = useMutation({
    mutationFn: async (progress: BodyProgress) => {
      const currentProgress = bodyProgressQuery.data || [];
      const updatedProgress = [...currentProgress, progress];
      await AsyncStorage.setItem(STORAGE_KEYS.BODY_PROGRESS, JSON.stringify(updatedProgress));
      return updatedProgress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodyProgress'] });
    },
  });

  return {
    user,
    isLoading: isLoading || userQuery.isLoading,
    isPremium: user?.isPremium ?? false,
    isAdmin: user?.role === 'admin',
    updateUser: updateUserMutation.mutate,
    upgradeToPremium,
    switchRole,
    workoutLogs: workoutLogsQuery.data || [],
    saveWorkoutLog: saveWorkoutLogMutation.mutate,
    bodyProgress: bodyProgressQuery.data || [],
    saveBodyProgress: saveBodyProgressMutation.mutate,
  };
});
