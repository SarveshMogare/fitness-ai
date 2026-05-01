"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { DailyWorkout } from "@/lib/types";

const DIFFICULTY_LABELS = [
  "Too Easy",
  "Easy",
  "Just Right",
  "Hard",
  "Too Hard",
];

export function WorkoutFeedbackDialog({
  workout,
  onClose,
  onSubmitted,
}: {
  workout: DailyWorkout | null;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [difficulty, setDifficulty] = useState(3);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!workout) return;
    setIsSubmitting(true);

    const exercises = workout.exercises || [];
    const completedCount = exercises.filter((e) => e.completed).length;

    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        daily_workout_id: workout.id,
        difficulty_rating: difficulty,
        completed: true,
        exercises_completed: completedCount,
        total_exercises: exercises.length,
        feedback_notes: notes || null,
      }),
    });

    setIsSubmitting(false);
    setDifficulty(3);
    setNotes("");
    onSubmitted();
    onClose();
  };

  return (
    <Dialog open={!!workout} onOpenChange={() => onClose()}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            Workout Feedback
          </DialogTitle>
          <DialogDescription>
            Rate this workout to help AI adapt your next plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>How difficult was this workout?</Label>
            <div className="flex gap-2">
              {DIFFICULTY_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setDifficulty(i + 1)}
                  className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                    difficulty === i + 1
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-notes">
              Notes (optional)
            </Label>
            <Textarea
              id="feedback-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific feedback..."
              rows={2}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
