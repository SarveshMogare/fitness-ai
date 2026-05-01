"use client";

import useSWR from "swr";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProgressCharts } from "@/components/dashboard/progress-charts";
import type { ProgressLog } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProgressPage() {
  const { data, isLoading, mutate } = useSWR("/api/progress", fetcher);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    weight_kg: "",
    body_fat_pct: "",
    energy_level: "",
    sleep_hours: "",
    mood: "",
    notes: "",
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload: Record<string, unknown> = {};
    if (form.weight_kg) payload.weight_kg = Number(form.weight_kg);
    if (form.body_fat_pct) payload.body_fat_pct = Number(form.body_fat_pct);
    if (form.energy_level) payload.energy_level = Number(form.energy_level);
    if (form.sleep_hours) payload.sleep_hours = Number(form.sleep_hours);
    if (form.mood) payload.mood = Number(form.mood);
    if (form.notes) payload.notes = form.notes;

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({
      weight_kg: "",
      body_fat_pct: "",
      energy_level: "",
      sleep_hours: "",
      mood: "",
      notes: "",
    });
    setIsSubmitting(false);
    setOpen(false);
    mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const logs: ProgressLog[] = data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Progress Tracker
          </h2>
          <p className="text-muted-foreground">
            Log your metrics daily to visualize your journey.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Log Today
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">
                Log Progress
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={form.weight_kg}
                    onChange={(e) => update("weight_kg", e.target.value)}
                    placeholder="75.5"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bodyfat">Body Fat %</Label>
                  <Input
                    id="bodyfat"
                    type="number"
                    step="0.1"
                    value={form.body_fat_pct}
                    onChange={(e) => update("body_fat_pct", e.target.value)}
                    placeholder="18.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Energy Level</Label>
                  <Select
                    value={form.energy_level}
                    onValueChange={(v) => update("energy_level", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="1-5" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} - {["Very Low", "Low", "Normal", "High", "Very High"][n - 1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Mood</Label>
                  <Select
                    value={form.mood}
                    onValueChange={(v) => update("mood", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="1-5" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} - {["Poor", "Below Avg", "Average", "Good", "Great"][n - 1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sleep">Sleep (hours)</Label>
                <Input
                  id="sleep"
                  type="number"
                  step="0.5"
                  value={form.sleep_hours}
                  onChange={(e) => update("sleep_hours", e.target.value)}
                  placeholder="7.5"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="How are you feeling today?"
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
                Save Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {logs.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-16">
            <p className="text-lg font-medium text-card-foreground">
              No progress data yet
            </p>
            <p className="text-sm text-muted-foreground">
              Start logging daily to see charts and trends.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ProgressCharts logs={logs} />
      )}
    </div>
  );
}
