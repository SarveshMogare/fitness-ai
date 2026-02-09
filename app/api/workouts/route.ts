import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Get active workout plan with daily workouts and exercises
  const { data: plan } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!plan)
    return Response.json({ plan: null, workouts: [], nutrition: null });

  const { data: workouts } = await supabase
    .from("daily_workouts")
    .select("*, exercises(*)")
    .eq("plan_id", plan.id)
    .order("day_number", { ascending: true });

  // Get active nutrition plan with meals
  const { data: nutrition } = await supabase
    .from("nutrition_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let meals: unknown[] = [];
  if (nutrition) {
    const { data: mealsData } = await supabase
      .from("meals")
      .select("*")
      .eq("nutrition_plan_id", nutrition.id)
      .order("day_number", { ascending: true });
    meals = mealsData || [];
  }

  return Response.json({
    plan,
    workouts: workouts || [],
    nutrition: nutrition ? { ...nutrition, meals } : null,
  });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { workoutId, completed, exerciseId, exerciseCompleted } =
    await req.json();

  if (exerciseId !== undefined) {
    const { error } = await supabase
      .from("exercises")
      .update({ completed: exerciseCompleted })
      .eq("id", exerciseId)
      .eq("user_id", user.id);
    if (error)
      return Response.json({ error: error.message }, { status: 500 });
  }

  if (workoutId !== undefined) {
    const { error } = await supabase
      .from("daily_workouts")
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("id", workoutId)
      .eq("user_id", user.id);
    if (error)
      return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
