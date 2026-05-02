"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UtensilsCrossed } from "lucide-react";
import type { NutritionPlan, Meal } from "@/lib/types";

import { VideoModal } from "./video-modal";

interface NutritionSummaryProps {
  plan: (NutritionPlan & { meals: Meal[] }) | null;
  dayNumber: number;
}

export function NutritionSummary({ plan, dayNumber }: NutritionSummaryProps) {
  if (!plan) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">
            No nutrition plan yet. Generate a plan to see your meals.
          </p>
        </CardContent>
      </Card>
    );
  }

  const todayMeals = plan.meals?.filter((m) => m.day_number === dayNumber) || [];
  const totalCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = todayMeals.reduce((sum, m) => sum + (m.protein_g || 0), 0);
  const totalCarbs = todayMeals.reduce((sum, m) => sum + (m.carbs_g || 0), 0);
  const totalFat = todayMeals.reduce((sum, m) => sum + (m.fat_g || 0), 0);

  const macros = [
    {
      label: "Protein",
      value: totalProtein,
      target: plan.protein_g || 0,
      color: "#0d9668",
    },
    {
      label: "Carbs",
      value: totalCarbs,
      target: plan.carbs_g || 0,
      color: "#0ea5e9",
    },
    {
      label: "Fat",
      value: totalFat,
      target: plan.fat_g || 0,
      color: "#eab308",
    },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          Today{"'"}s Nutrition
        </CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-card-foreground">
            {totalCalories}
          </span>
          <span className="text-sm text-muted-foreground">
            / {plan.calorie_target} cal
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Macros */}
        <div className="grid grid-cols-3 gap-4">
          {macros.map((macro) => (
            <div key={macro.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {macro.label}
                </span>
                <span className="text-xs font-medium text-card-foreground">
                  {macro.value}g
                </span>
              </div>
              <Progress
                value={
                  macro.target > 0
                    ? Math.min((macro.value / macro.target) * 100, 100)
                    : 0
                }
                className="h-2"
              />
            </div>
          ))}
        </div>

        {/* Meals list */}
        <div className="space-y-2 pt-2">
          {todayMeals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium capitalize text-card-foreground">
                  {meal.meal_type}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {meal.meal_name}
                  </p>
                  <VideoModal 
                    searchQuery={`how to make ${meal.meal_name} recipe healthy`}
                    title={`Recipe: ${meal.meal_name}`}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {meal.calories} cal
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
