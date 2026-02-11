import { Recipe } from '@/types';

export const sampleRecipes: Recipe[] = [
  {
    id: 'recipe1',
    title: 'Protein Power Bowl',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    prepTime: 15,
    calories: 420,
    ingredients: [
      '150g grilled chicken breast',
      '1 cup cooked quinoa',
      '1/2 avocado, sliced',
      '1 cup mixed greens',
      '1/4 cup cherry tomatoes',
      '2 tbsp olive oil dressing',
    ],
    instructions: [
      'Cook quinoa according to package instructions and let cool slightly.',
      'Grill or pan-sear the chicken breast until cooked through.',
      'Arrange mixed greens in a bowl as the base.',
      'Top with quinoa, sliced chicken, avocado, and cherry tomatoes.',
      'Drizzle with olive oil dressing and enjoy!',
    ],
    isPremium: false,
  },
  {
    id: 'recipe2',
    title: 'Berry Protein Smoothie',
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=400&fit=crop',
    prepTime: 5,
    calories: 280,
    ingredients: [
      '1 scoop vanilla protein powder',
      '1 cup mixed berries (frozen)',
      '1 banana',
      '1 cup almond milk',
      '1 tbsp almond butter',
      'Ice cubes',
    ],
    instructions: [
      'Add almond milk to your blender first.',
      'Add frozen berries, banana, and protein powder.',
      'Add almond butter and a handful of ice.',
      'Blend until smooth and creamy.',
      'Pour into a glass and enjoy immediately!',
    ],
    isPremium: false,
  },
  {
    id: 'recipe3',
    title: 'Mediterranean Salmon',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
    prepTime: 25,
    calories: 520,
    ingredients: [
      '200g salmon fillet',
      '1 cup roasted vegetables',
      '1/4 cup hummus',
      'Fresh dill and lemon',
      '1 tbsp olive oil',
    ],
    instructions: [
      'Preheat oven to 200°C (400°F).',
      'Season salmon with olive oil, salt, and pepper.',
      'Bake for 15-18 minutes until cooked through.',
      'Serve with roasted vegetables and hummus.',
      'Garnish with fresh dill and lemon wedges.',
    ],
    isPremium: true,
  },
];

export const freePreviewRecipes = sampleRecipes.filter(r => !r.isPremium);

export default sampleRecipes;
