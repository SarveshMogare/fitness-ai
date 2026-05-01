export type FitnessGoal =
  | "lose_weight"
  | "build_muscle"
  | "maintain"
  | "improve_endurance"
  | "general_fitness";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

export type DietaryPreference =
  | "none"
  | "vegetarian"
  | "vegan"
  | "keto"
  | "paleo"
  | "gluten_free";

export type Gender = "male" | "female" | "other";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  age: number | null;
  gender: Gender | null;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_goal: FitnessGoal | null;
  experience_level: ExperienceLevel;
  activity_level: ActivityLevel;
  available_equipment: string[];
  dietary_preference: DietaryPreference;
  injuries_notes: string | null;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  difficulty_level: ExperienceLevel;
  duration_weeks: number;
  is_active: boolean;
  ai_model: string | null;
  created_at: string;
}

export interface DailyWorkout {
  id: string;
  plan_id: string;
  user_id: string;
  day_number: number;
  day_name: string;
  workout_type: string;
  is_rest_day: boolean;
  estimated_duration_min: number | null;
  calories_burn_estimate: number | null;
  completed: boolean;
  completed_at: string | null;
  difficulty_rating: number | null;
  notes: string | null;
  created_at: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  daily_workout_id: string;
  user_id: string;
  name: string;
  muscle_group: string | null;
  sets: number | null;
  reps: string | null;
  weight_suggestion: string | null;
  rest_seconds: number | null;
  duration_seconds: number | null;
  order_index: number;
  completed: boolean;
  created_at: string;
}

export interface NutritionPlan {
  id: string;
  user_id: string;
  plan_id: string | null;
  tdee_estimate: number | null;
  calorie_target: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  meals_per_day: number;
  is_active: boolean;
  created_at: string;
}

export interface Meal {
  id: string;
  nutrition_plan_id: string;
  user_id: string;
  day_number: number;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  meal_name: string;
  description: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  ingredients: string[];
  created_at: string;
}

export interface ProgressLog {
  id: string;
  user_id: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  energy_level: number | null;
  sleep_hours: number | null;
  mood: number | null;
  notes: string | null;
  logged_at: string;
  created_at: string;
}

export interface WorkoutFeedback {
  id: string;
  user_id: string;
  daily_workout_id: string;
  difficulty_rating: number;
  completed: boolean;
  exercises_completed: number;
  total_exercises: number;
  feedback_notes: string | null;
  created_at: string;
}

// AI generation types
export interface AIWorkoutDay {
  day_number: number;
  day_name: string;
  workout_type: string;
  is_rest_day: boolean;
  estimated_duration_min: number;
  calories_burn_estimate: number;
  exercises: AIExercise[];
}

export interface AIExercise {
  name: string;
  muscle_group: string;
  sets: number;
  reps: string;
  weight_suggestion: string;
  rest_seconds: number;
  duration_seconds: number | null;
  order_index: number;
}

export interface AINutritionPlan {
  tdee_estimate: number;
  calorie_target: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meals_per_day: number;
  meals: AIMeal[];
}

export interface AIMeal {
  day_number: number;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  meal_name: string;
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients: string[];
}

export interface AIGeneratedPlan {
  workout_plan: {
    title: string;
    description: string;
    difficulty_level: ExperienceLevel;
    days: AIWorkoutDay[];
  };
  nutrition_plan: AINutritionPlan;
}
