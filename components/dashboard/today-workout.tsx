"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, Dumbbell, PlayCircle } from "lucide-react";
import type { DailyWorkout, Exercise } from "@/lib/types";

import { VideoModal } from "./video-modal";

export function TodayWorkout({
  workout,
  onToggleExercise,
}: {
  workout: DailyWorkout | null;
  onToggleExercise: (exerciseId: string, completed: boolean) => void;
}) {
  if (!workout) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">
            No workout scheduled for today. Generate a plan to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (workout.is_rest_day) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Dumbbell className="h-5 w-5 text-primary" />
            {workout.day_name} - Rest Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Recovery is essential. Consider light stretching or a gentle walk.
          </p>
        </CardContent>
      </Card>
    );
  }

  const exercises = workout.exercises || [];
  const completedCount = exercises.filter((e) => e.completed).length;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Dumbbell className="h-5 w-5 text-primary" />
              {workout.day_name}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {workout.workout_type}
            </p>
          </div>
          <Badge
            variant={
              completedCount === exercises.length ? "default" : "secondary"
            }
          >
            {completedCount}/{exercises.length}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {exercises
            .sort((a: Exercise, b: Exercise) => a.order_index - b.order_index)
            .map((exercise: Exercise) => (
              <div
                key={exercise.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  id={`exercise-${exercise.id}`}
                  checked={exercise.completed}
                  onCheckedChange={(checked) =>
                    onToggleExercise(exercise.id, checked === true)
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`exercise-${exercise.id}`}
                      className={`cursor-pointer text-sm font-medium ${exercise.completed ? "text-muted-foreground line-through" : "text-card-foreground"}`}
                    >
                      {exercise.name}
                    </label>
                    <VideoModal 
                      searchQuery={`how to do ${exercise.name} exercise`}
                      title={`How to do: ${exercise.name}`}
                    />
                  </div>
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
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
