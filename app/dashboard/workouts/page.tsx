"use client";

import useSWR from "swr";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Clock, Flame, CheckCircle2, Loader2 } from "lucide-react";
import { GeneratePlanButton } from "@/components/dashboard/generate-plan-button";
import { WorkoutFeedbackDialog } from "@/components/dashboard/workout-feedback-dialog";
import type { DailyWorkout, Exercise } from "@/lib/types";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function WorkoutsPage() {
  const { data, isLoading, mutate } = useSWR("/api/workouts", fetcher);
  const [feedbackWorkout, setFeedbackWorkout] = useState<DailyWorkout | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const workouts: DailyWorkout[] = data?.workouts || [];
  const plan = data?.plan;

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg text-muted-foreground">
          No workout plan yet. Let AI create one for you.
        </p>
        <GeneratePlanButton onSuccess={() => mutate()} hasExistingPlan={false} />
      </div>
    );
  }

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

  const handleCompleteWorkout = async (workout: DailyWorkout) => {
    await fetch("/api/workouts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workoutId: workout.id, completed: true }),
    });
    setFeedbackWorkout(workout);
    mutate();
  };

  const dayOfWeek = new Date().getDay();
  const todayNumber = dayOfWeek === 0 ? 7 : dayOfWeek;
  const defaultTab = `day-${todayNumber}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{plan.title}</h2>
          <p className="text-muted-foreground">{plan.description}</p>
        </div>
        <GeneratePlanButton onSuccess={() => mutate()} hasExistingPlan={true} />
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {workouts.map((w) => (
            <TabsTrigger key={w.id} value={`day-${w.day_number}`} className="gap-1.5">
              {w.day_name.slice(0, 3)}
              {w.completed && (
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {workouts.map((workout) => {
          const exercises: Exercise[] = workout.exercises || [];
          const completedExercises = exercises.filter((e) => e.completed).length;

          return (
            <TabsContent key={workout.id} value={`day-${workout.day_number}`}>
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-card-foreground">
                        {workout.day_name} -{" "}
                        {workout.is_rest_day ? "Rest Day" : workout.workout_type}
                      </CardTitle>
                      <CardDescription>
                        {workout.is_rest_day
                          ? "Take it easy. Focus on recovery."
                          : workout.notes || "Complete all exercises below"}
                      </CardDescription>
                    </div>
                    {!workout.is_rest_day && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {workout.estimated_duration_min && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {workout.estimated_duration_min} min
                          </span>
                        )}
                        {workout.calories_burn_estimate && (
                          <span className="flex items-center gap-1">
                            <Flame className="h-3.5 w-3.5" />
                            {workout.calories_burn_estimate} cal
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                {!workout.is_rest_day && (
                  <CardContent className="space-y-3">
                    {exercises
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((exercise) => (
                        <label
                          key={exercise.id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={exercise.completed}
                            onCheckedChange={(checked) =>
                              handleToggleExercise(exercise.id, checked === true)
                            }
                          />
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${exercise.completed ? "text-muted-foreground line-through" : "text-card-foreground"}`}
                            >
                              {exercise.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {exercise.sets && `${exercise.sets} sets`}
                              {exercise.reps && ` x ${exercise.reps}`}
                              {exercise.weight_suggestion &&
                                ` - ${exercise.weight_suggestion}`}
                              {exercise.rest_seconds &&
                                ` | ${exercise.rest_seconds}s rest`}
                            </p>
                          </div>
                          {exercise.muscle_group && (
                            <Badge variant="outline" className="text-xs">
                              {exercise.muscle_group}
                            </Badge>
                          )}
                        </label>
                      ))}

                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <span className="text-sm text-muted-foreground">
                        {completedExercises}/{exercises.length} exercises done
                      </span>
                      {!workout.completed && (
                        <Button
                          onClick={() => handleCompleteWorkout(workout)}
                          size="sm"
                        >
                          Complete Workout
                        </Button>
                      )}
                      {workout.completed && (
                        <Badge className="bg-primary text-primary-foreground">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <WorkoutFeedbackDialog
        workout={feedbackWorkout}
        onClose={() => setFeedbackWorkout(null)}
        onSubmitted={() => mutate()}
      />
    </div>
  );
}
