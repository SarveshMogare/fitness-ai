"use client";

import useSWR from "swr";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Loader2, Flame, Beef, Wheat, Droplets } from "lucide-react";
import { GeneratePlanButton } from "@/components/dashboard/generate-plan-button";
import type { Meal } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function NutritionPage() {
  const { data, isLoading, mutate } = useSWR("/api/workouts", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const nutrition = data?.nutrition;

  if (!nutrition) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg text-muted-foreground">
          No nutrition plan yet. Generate a plan to get started.
        </p>
        <GeneratePlanButton onSuccess={() => mutate()} hasExistingPlan={false} />
      </div>
    );
  }

  const meals: Meal[] = nutrition.meals || [];
  const dayOfWeek = new Date().getDay();
  const todayNumber = dayOfWeek === 0 ? 7 : dayOfWeek;
  const defaultTab = `day-${todayNumber}`;

  return (
    <div className="space-y-6">
      {/* TDEE Overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">TDEE</p>
              <p className="text-lg font-bold text-card-foreground">
                {nutrition.tdee_estimate} cal
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(13, 150, 104, 0.1)" }}>
              <Beef className="h-5 w-5" style={{ color: "#0d9668" }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="text-lg font-bold text-card-foreground">
                {nutrition.protein_g}g
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(14, 165, 233, 0.1)" }}>
              <Wheat className="h-5 w-5" style={{ color: "#0ea5e9" }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="text-lg font-bold text-card-foreground">
                {nutrition.carbs_g}g
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(234, 179, 8, 0.1)" }}>
              <Droplets className="h-5 w-5" style={{ color: "#eab308" }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fat</p>
              <p className="text-lg font-bold text-card-foreground">
                {nutrition.fat_g}g
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Meals */}
      <Tabs defaultValue={defaultTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {DAY_NAMES.map((day, i) => (
            <TabsTrigger key={day} value={`day-${i + 1}`}>
              {day.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>

        {DAY_NAMES.map((day, i) => {
          const dayMeals = meals.filter((m) => m.day_number === i + 1);
          const dayCalories = dayMeals.reduce(
            (sum, m) => sum + (m.calories || 0),
            0
          );
          const dayProtein = dayMeals.reduce(
            (sum, m) => sum + (m.protein_g || 0),
            0
          );
          const dayCarbs = dayMeals.reduce(
            (sum, m) => sum + (m.carbs_g || 0),
            0
          );
          const dayFat = dayMeals.reduce(
            (sum, m) => sum + (m.fat_g || 0),
            0
          );

          return (
            <TabsContent key={day} value={`day-${i + 1}`}>
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-card-foreground">{day}</CardTitle>
                    <Badge variant="outline">{dayCalories} cal total</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Protein</span>
                        <span>{dayProtein}g / {nutrition.protein_g}g</span>
                      </div>
                      <Progress
                        value={
                          nutrition.protein_g > 0
                            ? Math.min(
                                (dayProtein / nutrition.protein_g) * 100,
                                100
                              )
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Carbs</span>
                        <span>{dayCarbs}g / {nutrition.carbs_g}g</span>
                      </div>
                      <Progress
                        value={
                          nutrition.carbs_g > 0
                            ? Math.min(
                                (dayCarbs / nutrition.carbs_g) * 100,
                                100
                              )
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Fat</span>
                        <span>{dayFat}g / {nutrition.fat_g}g</span>
                      </div>
                      <Progress
                        value={
                          nutrition.fat_g > 0
                            ? Math.min(
                                (dayFat / nutrition.fat_g) * 100,
                                100
                              )
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dayMeals.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No meals planned for this day.
                    </p>
                  ) : (
                    dayMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="rounded-lg border border-border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="secondary" className="mb-2 capitalize">
                              {meal.meal_type}
                            </Badge>
                            <h4 className="font-medium text-card-foreground">
                              {meal.meal_name}
                            </h4>
                            {meal.description && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {meal.description}
                              </p>
                            )}
                          </div>
                          <span className="text-sm font-medium text-card-foreground">
                            {meal.calories} cal
                          </span>
                        </div>
                        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                          <span>P: {meal.protein_g}g</span>
                          <span>C: {meal.carbs_g}g</span>
                          <span>F: {meal.fat_g}g</span>
                        </div>
                        {meal.ingredients && meal.ingredients.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {meal.ingredients.map((ing) => (
                              <Badge key={ing} variant="outline" className="text-xs">
                                {ing}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
