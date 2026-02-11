import { Program, Exercise, WorkoutDay, ProgramWeek } from '@/types';

const createExercise = (
  id: string,
  name: string,
  sets: number,
  reps: number,
  restTime: number,
  instructions: string,
  imageUrl: string
): Exercise => ({
  id,
  name,
  imageUrl,
  sets,
  reps,
  restTime,
  instructions,
});

const sampleExercises: Exercise[] = [
  createExercise(
    'ex1',
    'Goblet Squats',
    3,
    12,
    45,
    'Hold the weight close to your chest. Keep your back straight, push your hips back and lower until thighs are parallel to the floor. Drive through your heels to return to standing.',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop'
  ),
  createExercise(
    'ex2',
    'Romanian Deadlifts',
    3,
    10,
    60,
    'Stand with feet hip-width apart, holding weights in front of thighs. Hinge at hips, pushing them back while keeping a slight bend in knees. Lower weights along legs until you feel a stretch in hamstrings, then squeeze glutes to return.',
    'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&h=300&fit=crop'
  ),
  createExercise(
    'ex3',
    'Hip Thrusts',
    3,
    15,
    45,
    'Sit on the floor with upper back against a bench. Roll the barbell over your hips. Drive through heels and squeeze glutes to lift hips until body forms a straight line from shoulders to knees.',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop'
  ),
  createExercise(
    'ex4',
    'Walking Lunges',
    3,
    12,
    45,
    'Step forward with one leg, lowering your hips until both knees are bent at about 90 degrees. Push through the front heel to bring your back leg forward into the next lunge.',
    'https://images.unsplash.com/photo-1609899464926-209d2e76d98a?w=400&h=300&fit=crop'
  ),
  createExercise(
    'ex5',
    'Glute Bridges',
    3,
    20,
    30,
    'Lie on your back with knees bent and feet flat on the floor. Squeeze your glutes to lift your hips toward the ceiling, creating a straight line from shoulders to knees. Hold for a moment at the top.',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop'
  ),
];

const upperBodyExercises: Exercise[] = [
  createExercise(
    'ex6',
    'Push-Ups',
    3,
    10,
    45,
    'Start in a plank position with hands slightly wider than shoulder-width. Lower your chest toward the floor keeping your body in a straight line. Push back up to starting position.',
    'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop'
  ),
  createExercise(
    'ex7',
    'Bent-Over Rows',
    3,
    12,
    45,
    'Hinge at hips with a flat back, arms hanging down with weights. Pull elbows back squeezing shoulder blades together. Lower with control.',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop'
  ),
  createExercise(
    'ex8',
    'Shoulder Press',
    3,
    10,
    60,
    'Hold weights at shoulder height, palms facing forward. Press weights overhead until arms are fully extended. Lower back to shoulders with control.',
    'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop'
  ),
];

const coreExercises: Exercise[] = [
  createExercise(
    'ex9',
    'Plank Hold',
    3,
    45,
    30,
    'Hold your body in a straight line from head to heels, supported on forearms and toes. Keep your core tight and hips level. Hold for the prescribed time.',
    'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&h=300&fit=crop'
  ),
  createExercise(
    'ex10',
    'Dead Bug',
    3,
    12,
    30,
    'Lie on your back with arms reaching toward ceiling and knees bent at 90 degrees. Slowly lower opposite arm and leg toward floor while keeping your back flat. Return and repeat on other side.',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
  ),
];

const noteTemplates = [
  { id: 'weight', label: 'Weight Used (kg)', type: 'number' as const, placeholder: 'Enter weight' },
  { id: 'notes', label: 'How did it feel?', type: 'text' as const, placeholder: 'Any notes about this workout...' },
];

const generateWeeks = (numWeeks: number): ProgramWeek[] => {
  const weeks: ProgramWeek[] = [];
  
  for (let i = 1; i <= numWeeks; i++) {
    const days: WorkoutDay[] = [
      {
        id: `w${i}-d1`,
        dayNumber: 1,
        title: 'Lower Body Strength',
        thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop',
        exercises: sampleExercises.slice(0, 4),
        noteTemplates,
      },
      {
        id: `w${i}-d2`,
        dayNumber: 2,
        title: 'Upper Body & Core',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=150&fit=crop',
        exercises: [...upperBodyExercises, ...coreExercises].slice(0, 5),
        noteTemplates,
      },
      {
        id: `w${i}-d3`,
        dayNumber: 3,
        title: 'Active Recovery',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop',
        exercises: coreExercises,
        noteTemplates,
      },
      {
        id: `w${i}-d4`,
        dayNumber: 4,
        title: 'Glute Focus',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=150&fit=crop',
        exercises: [sampleExercises[2], sampleExercises[4], sampleExercises[0], sampleExercises[3]],
        noteTemplates,
      },
    ];
    
    weeks.push({ weekNumber: i, days });
  }
  
  return weeks;
};

export const samplePrograms: Program[] = [
  {
    id: 'prog1',
    title: 'Strong & Sculpted',
    imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=400&fit=crop',
    description: 'A comprehensive 12-week program designed to build strength, tone muscles, and boost your confidence. Perfect for women who want to feel powerful and look amazing.',
    categories: ['Strength', 'Toning', 'Full Body'],
    difficulty: 'Intermediate',
    durationWeeks: 12,
    weeks: generateWeeks(12),
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published',
  },
  {
    id: 'prog2',
    title: 'Beginner Foundations',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    description: 'Start your fitness journey with this gentle but effective 8-week program. Learn proper form, build a solid foundation, and develop healthy habits that last.',
    categories: ['Beginner', 'Full Body', 'Learn'],
    difficulty: 'Beginner',
    durationWeeks: 8,
    weeks: generateWeeks(8),
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published',
  },
  {
    id: 'prog3',
    title: 'Booty Builder',
    imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=600&h=400&fit=crop',
    description: 'Focus on building strong, sculpted glutes with this targeted 10-week program. Includes progressive overload techniques and glute activation exercises.',
    categories: ['Glutes', 'Lower Body', 'Sculpting'],
    difficulty: 'Intermediate',
    durationWeeks: 10,
    weeks: generateWeeks(10),
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
  },
];

export const freePreviewExercises: Exercise[] = [
  sampleExercises[0],
  sampleExercises[4],
];

export default samplePrograms;
