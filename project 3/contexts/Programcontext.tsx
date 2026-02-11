import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Program, ProgramStatus } from '@/types';
import { samplePrograms } from '@/mocks/programs';

const STORAGE_KEY = 'programs_data';

export const [ProgramProvider, usePrograms] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [programs, setPrograms] = useState<Program[]>([]);

  const programsQuery = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Program[];
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(samplePrograms));
      return samplePrograms;
    },
  });

  useEffect(() => {
    if (programsQuery.data) {
      setPrograms(programsQuery.data);
    }
  }, [programsQuery.data]);

  const addProgramMutation = useMutation({
    mutationFn: async (program: Program) => {
      const updatedPrograms = [...programs, program];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrograms));
      return updatedPrograms;
    },
    onSuccess: (updatedPrograms) => {
      setPrograms(updatedPrograms);
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });

  const updateProgramMutation = useMutation({
    mutationFn: async (program: Program) => {
      const updatedPrograms = programs.map(p => p.id === program.id ? program : p);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrograms));
      return updatedPrograms;
    },
    onSuccess: (updatedPrograms) => {
      setPrograms(updatedPrograms);
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: async (programId: string) => {
      const updatedPrograms = programs.filter(p => p.id !== programId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrograms));
      return updatedPrograms;
    },
    onSuccess: (updatedPrograms) => {
      setPrograms(updatedPrograms);
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });

  const duplicateProgramMutation = useMutation({
    mutationFn: async (programId: string) => {
      const original = programs.find(p => p.id === programId);
      if (!original) throw new Error('Program not found');
      
      const duplicated: Program = {
        ...original,
        id: Date.now().toString(),
        title: `${original.title} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        weeks: original.weeks.map(week => ({
          ...week,
          days: week.days.map(day => ({
            ...day,
            id: `${Date.now()}-${day.id}`,
            exercises: day.exercises.map(ex => ({
              ...ex,
              id: `${Date.now()}-${ex.id}`,
            })),
          })),
        })),
      };
      
      const updatedPrograms = [...programs, duplicated];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrograms));
      return updatedPrograms;
    },
    onSuccess: (updatedPrograms) => {
      setPrograms(updatedPrograms);
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });

  const toggleProgramStatusMutation = useMutation({
    mutationFn: async ({ programId, status }: { programId: string; status: ProgramStatus }) => {
      const updatedPrograms = programs.map(p => 
        p.id === programId 
          ? { ...p, status, updatedAt: new Date().toISOString() } 
          : p
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrograms));
      return updatedPrograms;
    },
    onSuccess: (updatedPrograms) => {
      setPrograms(updatedPrograms);
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });

  const getProgramById = (id: string) => programs.find(p => p.id === id);
  
  const publishedPrograms = programs.filter(p => p.status === 'published');
  const draftPrograms = programs.filter(p => p.status === 'draft');

  return {
    programs,
    publishedPrograms,
    draftPrograms,
    isLoading: programsQuery.isLoading,
    addProgram: addProgramMutation.mutate,
    updateProgram: updateProgramMutation.mutate,
    deleteProgram: deleteProgramMutation.mutate,
    duplicateProgram: duplicateProgramMutation.mutate,
    toggleProgramStatus: toggleProgramStatusMutation.mutate,
    getProgramById,
  };
});
