export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isPremium: boolean;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  measurements?: {
    bust?: number;
    waist?: number;
    hips?: number;
  };
  profilePicture?: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  videoUrl?: string;
  imageUrl: string;
  sets: number;
  reps: number;
  restTime: number;
  instructions: string;
}

export interface NoteTemplate {
  id: string;
  label: string;
  type: 'number' | 'text';
  placeholder?: string;
}

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  title: string;
  thumbnailUrl: string;
  exercises: Exercise[];
  noteTemplates: NoteTemplate[];
}

export interface ProgramWeek {
  weekNumber: number;
  days: WorkoutDay[];
}

export type ProgramStatus = 'draft' | 'published';

export interface Program {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  categories: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  weeks: ProgramWeek[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: ProgramStatus;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  programId: string;
  weekNumber: number;
  dayId: string;
  completedAt: string;
  notes: Record<string, string | number>;
  exercises: {
    exerciseId: string;
    completed: boolean;
    weights?: number[];
  }[];
}

export interface BodyProgress {
  id: string;
  userId: string;
  photoUrl: string;
  date: string;
  weight?: number;
  notes?: string;
}

export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  prepTime: number;
  calories: number;
  ingredients: string[];
  instructions: string[];
  isPremium: boolean;
}
