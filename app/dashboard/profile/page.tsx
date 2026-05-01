"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save } from "lucide-react";
import type { Profile } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const EQUIPMENT_OPTIONS = [
  "Barbell",
  "Dumbbells",
  "Kettlebells",
  "Resistance Bands",
  "Pull-up Bar",
  "Bench",
  "Cable Machine",
  "Treadmill",
  "Stationary Bike",
  "Yoga Mat",
];

export default function ProfilePage() {
  const { data: profile, isLoading, mutate } = useSWR<Profile>(
    "/api/profile",
    fetcher
  );
  const [form, setForm] = useState<Partial<Profile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const update = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleEquipment = (item: string) => {
    const current = form.available_equipment || [];
    update(
      "available_equipment",
      current.includes(item)
        ? current.filter((e) => e !== item)
        : [...current, item]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: form.full_name,
        age: form.age ? Number(form.age) : null,
        gender: form.gender,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        fitness_goal: form.fitness_goal,
        experience_level: form.experience_level,
        activity_level: form.activity_level,
        available_equipment: form.available_equipment,
        dietary_preference: form.dietary_preference,
        injuries_notes: form.injuries_notes,
      }),
    });
    setIsSaving(false);
    setSaved(true);
    mutate();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your profile to improve AI plan accuracy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.full_name || ""}
              onChange={(e) => update("full_name", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={form.age || ""}
                onChange={(e) => update("age", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={form.height_cm || ""}
                onChange={(e) => update("height_cm", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={form.weight_kg || ""}
                onChange={(e) => update("weight_kg", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Gender</Label>
              <Select
                value={form.gender || ""}
                onValueChange={(v) => update("gender", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Fitness Goal</Label>
              <Select
                value={form.fitness_goal || ""}
                onValueChange={(v) => update("fitness_goal", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">Lose Weight</SelectItem>
                  <SelectItem value="build_muscle">Build Muscle</SelectItem>
                  <SelectItem value="maintain">Maintain</SelectItem>
                  <SelectItem value="improve_endurance">
                    Improve Endurance
                  </SelectItem>
                  <SelectItem value="general_fitness">
                    General Fitness
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Experience Level</Label>
              <Select
                value={form.experience_level || "beginner"}
                onValueChange={(v) => update("experience_level", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Activity Level</Label>
              <Select
                value={form.activity_level || "sedentary"}
                onValueChange={(v) => update("activity_level", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="lightly_active">
                    Lightly Active
                  </SelectItem>
                  <SelectItem value="moderately_active">
                    Moderately Active
                  </SelectItem>
                  <SelectItem value="very_active">Very Active</SelectItem>
                  <SelectItem value="extra_active">Extra Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Equipment</CardTitle>
          <CardDescription>
            What equipment do you have access to?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {EQUIPMENT_OPTIONS.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted"
              >
                <Checkbox
                  checked={(form.available_equipment || []).includes(item)}
                  onCheckedChange={() => toggleEquipment(item)}
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Diet & Medical Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Dietary Preference</Label>
            <Select
              value={form.dietary_preference || "none"}
              onValueChange={(v) => update("dietary_preference", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No restrictions</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="gluten_free">Gluten Free</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="injuries">Injuries or Medical Notes</Label>
            <Textarea
              id="injuries"
              value={form.injuries_notes || ""}
              onChange={(e) => update("injuries_notes", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm text-primary">Profile saved</span>
        )}
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
