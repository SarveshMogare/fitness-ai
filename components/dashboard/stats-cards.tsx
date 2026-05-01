"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Flame, Target, Clock, TrendingUp } from "lucide-react";
import type { DailyWorkout, NutritionPlan } from "@/lib/types";

interface StatsCardsProps {
  workouts: DailyWorkout[];
  nutrition: NutritionPlan | null;
}

export function StatsCards({ workouts, nutrition }: StatsCardsProps) {
  const completedWorkouts = workouts.filter((w) => w.completed).length;
  const totalWorkouts = workouts.filter((w) => !w.is_rest_day).length;
  const totalCalBurn = workouts.reduce(
    (sum, w) => sum + (w.calories_burn_estimate || 0),
    0
  );
  const totalDuration = workouts.reduce(
    (sum, w) => sum + (w.estimated_duration_min || 0),
    0
  );

  const stats = [
    {
      label: "Workouts Done",
      value: `${completedWorkouts}/${totalWorkouts}`,
      icon: Target,
      description: "this week",
    },
    {
      label: "Calories to Burn",
      value: totalCalBurn.toLocaleString(),
      icon: Flame,
      description: "estimated total",
    },
    {
      label: "Training Time",
      value: `${totalDuration} min`,
      icon: Clock,
      description: "this week",
    },
    {
      label: "Daily Calories",
      value: nutrition?.calorie_target?.toLocaleString() || "--",
      icon: TrendingUp,
      description: "TDEE target",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-card-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
