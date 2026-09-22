export type UserGoal = 'Build Muscle' | 'Lose Fat' | 'Get Stronger' | 'Improve Fitness' | 'Stay Active';
export type UserExperience = 'Complete Beginner' | 'Some Experience' | 'Experienced';
export type TrainingSchedule = '2 days' | '3 days' | '4 days' | '5+ days';
export type WorkoutDuration = '20–30 min' | '30–45 min' | '45–60 min' | '60+ min';
export type EquipmentAccess = 'Full Gym' | 'Basic Gym' | 'Home Equipment' | 'Bodyweight Only';
export type UserGender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
export type UserCohort = 'new' | 'returning' | 'consistent' | 'inactive';

export interface UserProfile {
  name: string;
  age: number;
  gender: UserGender;
  height: number; // in cm
  heightUnit: 'cm' | 'ft';
  weight: number; // in kg
  weightUnit: 'kg' | 'lb';
  goal: UserGoal;
  experience: UserExperience;
  schedule: TrainingSchedule;
  duration: WorkoutDuration;
  equipment: EquipmentAccess;
  onboarded: boolean;
  cohort: UserCohort;
  dietaryPreference?: DietaryPreference;
  dailyBudgetTier?: BudgetTier;
  dailyBudgetAmount?: number;
  foodAllergies?: FoodAllergy[];
}

export type DietaryPreference = 'Veg' | 'Non-Veg' | 'Vegan' | 'Eggitarian';
export type BudgetTier = 'Budget' | 'Moderate' | 'Premium';
export type FoodAllergy = 'Dairy / Lactose' | 'Gluten' | 'Nuts / Peanuts' | 'Soy' | 'Eggs' | 'Seafood';

export interface FoodItem {
  id: string;
  name: string;
  quantityGrams: number;
  portionDesc: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  isVeg: boolean;
  allergens?: FoodAllergy[];
  estimatedCost: number; // in user currency
}

export type MealSlot = 'breakfast' | 'mid_morning' | 'lunch' | 'pre_workout' | 'dinner' | 'bedtime_snack';

export interface MealRecipe {
  title: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'Easy' | 'Moderate' | 'Quick';
  servings: number;
  ingredients: { item: string; amount: string; grams?: number }[];
  steps: string[];
  chefTip: string;
}

export interface Meal {
  id: string;
  slot: MealSlot;
  title: string;
  time: string; // e.g. "08:30" 24hr format
  timeLabel: string; // e.g. "8:30 AM"
  foods: FoodItem[];
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  targetFiber: number;
  prepTimeMinutes: number;
  eatingTip: string;
  estimatedCost: number;
  isEaten?: boolean;
  recipe?: MealRecipe;
}

export interface DailyDietPlan {
  id: string;
  goal: UserGoal;
  preference: DietaryPreference;
  budgetTier: BudgetTier;
  estimatedDailyCost: number;
  currencySymbol: string;
  totalCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatsGrams: number;
  targetFiberGrams: number;
  waterTargetLiters: number;
  dietStrategyTitle: string;
  dietStrategySummary: string;
  meals: Meal[];
  budgetTips: string[];
}

export interface DietFAQ {
  id: string;
  question: string;
  answer: string;
  category: 'Protein' | 'Budget' | 'Timing' | 'Allergies' | 'Weight Loss';
}

export type AnimationType =
  | 'bench_press'
  | 'pull_ups'
  | 'lat_pulldown'
  | 'shoulder_press'
  | 'bent_over_row'
  | 'cable_row'
  | 'dumbbell_curl'
  | 'tricep_pushdown'
  | 'incline_press'
  | 'chest_press'
  | 'squat'
  | 'goblet_squat'
  | 'deadlift';

export interface Exercise {
  id: string;
  name: string;
  targetMuscles: string[];
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number; // in kg
  weightUnit: 'kg' | 'lb';
  animationType: AnimationType;
  videoUrl?: string;
  videoPoster?: string;
  instructions: [string, string, string];
  formTip: string;
  commonMistake: string;
  alternativeExerciseId?: string;
  alternativeName?: string;
  alternativeReason?: string;
}

export interface SetRecord {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExerciseState {
  exercise: Exercise;
  targetSets: number;
  sets: SetRecord[];
  isCompleted: boolean;
}

export interface WorkoutSession {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  exercises: WorkoutExerciseState[];
  isCompleted: boolean;
  currentExerciseIndex: number;
}

export interface WorkoutLog {
  id: string;
  date: string;
  title: string;
  durationMin: number;
  exercisesCompleted: number;
  setsCompleted: number;
  highlightWin: string;
}

export interface StrengthProgressItem {
  exerciseName: string;
  initialWeight: number;
  currentWeight: number;
  targetWeight: number;
  unit: string;
  trend: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'buddy';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    actionType: 'start_workout' | 'replace_exercise' | 'reduce_weight' | 'switch_short_workout' | 'show_form_tip';
    payload?: any;
  }[];
}
