import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { buildFitnessSystemPrompt } from "@/lib/ai/system-prompt";
import type { Profile } from "@/lib/types";

const ExerciseSchema = z.object({
  name: z.string(),
  muscle_group: z.string(),
  sets: z.number(),
  reps: z.string(),
  weight_suggestion: z.string(),
  rest_seconds: z.number(),
  duration_seconds: z.number().nullable(),
  order_index: z.number(),
});

const WorkoutDaySchema = z.object({
  day_number: z.number(),
  day_name: z.string(),
  workout_type: z.string(),
  is_rest_day: z.boolean(),
  estimated_duration_min: z.number(),
  calories_burn_estimate: z.number(),
  exercises: z.array(ExerciseSchema),
});

const MealSchema = z.object({
  day_number: z.number(),
  meal_type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  meal_name: z.string(),
  description: z.string(),
  calories: z.number(),
  protein_g: z.number(),
  carbs_g: z.number(),
  fat_g: z.number(),
  ingredients: z.array(z.string()),
});

const PlanSchema = z.object({
  workout_plan: z.object({
    title: z.string(),
    description: z.string(),
    difficulty_level: z.enum(["beginner", "intermediate", "advanced"]),
    days: z.array(WorkoutDaySchema),
  }),
  nutrition_plan: z.object({
    tdee_estimate: z.number(),
    calorie_target: z.number(),
    protein_g: z.number(),
    carbs_g: z.number(),
    fat_g: z.number(),
    meals_per_day: z.number(),
    meals: z.array(MealSchema),
  }),
});

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  // Get recent feedback for adaptive difficulty
  const { data: feedback } = await supabase
    .from("workout_feedback")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const systemPrompt = buildFitnessSystemPrompt(
    profile as Profile,
    feedback || []
  );

  try {
    // Deactivate old plans
    await supabase
      .from("workout_plans")
      .update({ is_active: false })
      .eq("user_id", user.id);
    await supabase
      .from("nutrition_plans")
      .update({ is_active: false })
      .eq("user_id", user.id);

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt:
        "Generate a complete 7-day personalized workout and nutrition plan for this user. Return JSON only.",
      output: Output.object({ schema: PlanSchema }),
    });

    const plan = result.output;

    if (!plan) {
      return Response.json(
        { error: "Failed to generate plan" },
        { status: 500 }
      );
    }

    // Save workout plan
    const { data: workoutPlan, error: wpError } = await supabase
      .from("workout_plans")
      .insert({
        user_id: user.id,
        title: plan.workout_plan.title,
        description: plan.workout_plan.description,
        difficulty_level: plan.workout_plan.difficulty_level,
        duration_weeks: 1,
        is_active: true,
        ai_model: "gemini-2.5-flash",
      })
      .select()
      .single();

    if (wpError || !workoutPlan) {
      return Response.json(
        { error: "Failed to save workout plan" },
        { status: 500 }
      );
    }

    // Save daily workouts and exercises
    for (const day of plan.workout_plan.days) {
      const { data: dailyWorkout } = await supabase
        .from("daily_workouts")
        .insert({
          plan_id: workoutPlan.id,
          user_id: user.id,
          day_number: day.day_number,
          day_name: day.day_name,
          workout_type: day.workout_type,
          is_rest_day: day.is_rest_day,
          estimated_duration_min: day.estimated_duration_min,
          calories_burn_estimate: day.calories_burn_estimate,
        })
        .select()
        .single();

      if (dailyWorkout && day.exercises.length > 0) {
        const exercises = day.exercises.map((ex) => ({
          daily_workout_id: dailyWorkout.id,
          user_id: user.id,
          name: ex.name,
          muscle_group: ex.muscle_group,
          sets: ex.sets,
          reps: ex.reps,
          weight_suggestion: ex.weight_suggestion,
          rest_seconds: ex.rest_seconds,
          duration_seconds: ex.duration_seconds,
          order_index: ex.order_index,
        }));
        await supabase.from("exercises").insert(exercises);
      }
    }

    // Save nutrition plan
    const { data: nutritionPlan } = await supabase
      .from("nutrition_plans")
      .insert({
        user_id: user.id,
        plan_id: workoutPlan.id,
        tdee_estimate: plan.nutrition_plan.tdee_estimate,
        calorie_target: plan.nutrition_plan.calorie_target,
        protein_g: plan.nutrition_plan.protein_g,
        carbs_g: plan.nutrition_plan.carbs_g,
        fat_g: plan.nutrition_plan.fat_g,
        meals_per_day: plan.nutrition_plan.meals_per_day,
        is_active: true,
      })
      .select()
      .single();

    if (nutritionPlan) {
      const meals = plan.nutrition_plan.meals.map((meal) => ({
        nutrition_plan_id: nutritionPlan.id,
        user_id: user.id,
        day_number: meal.day_number,
        meal_type: meal.meal_type,
        meal_name: meal.meal_name,
        description: meal.description,
        calories: meal.calories,
        protein_g: meal.protein_g,
        carbs_g: meal.carbs_g,
        fat_g: meal.fat_g,
        ingredients: meal.ingredients,
      }));
      await supabase.from("meals").insert(meals);
    }

    return Response.json({ success: true, workoutPlanId: workoutPlan.id });
  } catch (error) {
    console.error("AI generation error:", error);
    return Response.json(
      { error: "Failed to generate plan. Please try again." },
      { status: 500 }
    );
  }
}
