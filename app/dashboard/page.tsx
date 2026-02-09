"use client";

import useSWR from "swr";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TodayWorkout } from "@/components/dashboard/today-workout";
import { NutritionSummary } from "@/components/dashboard/nutrition-summary";
import { GeneratePlanButton } from "@/components/dashboard/generate-plan-button";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const { data, isLoading, mutate } = useSWR("/api/workouts", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const plan = data?.plan;
  const workouts = data?.workouts || [];
  const nutrition = data?.nutrition;

  // Calculate today's day number (1-7 based on day of week, Mon=1)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayNumber = dayOfWeek === 0 ? 7 : dayOfWeek;
  const todayWorkout = workouts.find(
    (w: { day_number: number }) => w.day_number === dayNumber
  );

  const handleToggleExercise = async (
    exerciseId: string,
    completed: boolean
  ) => {
    await fetch("/api/workouts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseId, exerciseCompleted: completed }),
    });
    mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {plan ? "Your Week at a Glance" : "Welcome to FitForge"}
          </h2>
          <p className="text-muted-foreground">
            {plan
              ? `${plan.title} - ${plan.difficulty_level} level`
              : "Generate your first AI-powered fitness plan to begin."}
          </p>
        </div>
        <GeneratePlanButton onSuccess={() => mutate()} hasExistingPlan={!!plan} />
      </div>

      {plan && <StatsCards workouts={workouts} nutrition={nutrition} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayWorkout
          workout={todayWorkout || null}
          onToggleExercise={handleToggleExercise}
        />
        <NutritionSummary plan={nutrition} dayNumber={dayNumber} />
      </div>
    </div>
  );
}
