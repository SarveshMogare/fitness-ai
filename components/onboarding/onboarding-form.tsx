"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

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

const STEPS = ["basics", "fitness", "equipment", "diet"] as const;
type Step = (typeof STEPS)[number];

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    fitness_goal: "",
    experience_level: "beginner",
    activity_level: "sedentary",
    available_equipment: [] as string[],
    dietary_preference: "none",
    injuries_notes: "",
  });

  const update = (key: string, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleEquipment = (item: string) => {
    const current = form.available_equipment;
    update(
      "available_equipment",
      current.includes(item)
        ? current.filter((e) => e !== item)
        : [...current, item]
    );
  };

  const stepIndex = STEPS.indexOf(step);
  const canNext =
    step === "basics"
      ? form.full_name && form.age && form.gender && form.height_cm && form.weight_kg
      : step === "fitness"
        ? form.fitness_goal
        : true;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          height_cm: Number(form.height_cm),
          weight_kg: Number(form.weight_kg),
          onboarding_complete: true,
        }),
      });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch {
      // handled silently
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  i <= stepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-8 ${i < stepIndex ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>
        <CardTitle className="mt-4">
          {step === "basics" && "Basic Information"}
          {step === "fitness" && "Fitness Goals"}
          {step === "equipment" && "Available Equipment"}
          {step === "diet" && "Diet & Notes"}
        </CardTitle>
        <CardDescription>
          {step === "basics" && "We need your biometrics for accurate calculations."}
          {step === "fitness" && "What are you training for?"}
          {step === "equipment" && "Select what you have access to."}
          {step === "diet" && "Any dietary restrictions or injuries to note?"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "basics" && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  placeholder="28"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => update("gender", v)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={form.height_cm}
                  onChange={(e) => update("height_cm", e.target.value)}
                  placeholder="175"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={form.weight_kg}
                  onChange={(e) => update("weight_kg", e.target.value)}
                  placeholder="75"
                />
              </div>
            </div>
          </>
        )}

        {step === "fitness" && (
          <>
            <div className="grid gap-2">
              <Label>Fitness Goal</Label>
              <Select
                value={form.fitness_goal}
                onValueChange={(v) => update("fitness_goal", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
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
            <div className="grid gap-2">
              <Label>Experience Level</Label>
              <Select
                value={form.experience_level}
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
                value={form.activity_level}
                onValueChange={(v) => update("activity_level", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">
                    Sedentary (office job)
                  </SelectItem>
                  <SelectItem value="lightly_active">
                    Lightly Active (1-3 days/week)
                  </SelectItem>
                  <SelectItem value="moderately_active">
                    Moderately Active (3-5 days/week)
                  </SelectItem>
                  <SelectItem value="very_active">
                    Very Active (6-7 days/week)
                  </SelectItem>
                  <SelectItem value="extra_active">
                    Extra Active (athlete)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {step === "equipment" && (
          <div className="grid grid-cols-2 gap-3">
            {EQUIPMENT_OPTIONS.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted"
              >
                <Checkbox
                  checked={form.available_equipment.includes(item)}
                  onCheckedChange={() => toggleEquipment(item)}
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        )}

        {step === "diet" && (
          <>
            <div className="grid gap-2">
              <Label>Dietary Preference</Label>
              <Select
                value={form.dietary_preference}
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
              <Label htmlFor="injuries">
                Injuries or Medical Notes (optional)
              </Label>
              <Textarea
                id="injuries"
                value={form.injuries_notes}
                onChange={(e) => update("injuries_notes", e.target.value)}
                placeholder="E.g., knee injury, lower back pain..."
                rows={3}
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setStep(STEPS[stepIndex - 1])}
            disabled={stepIndex === 0}
          >
            Back
          </Button>
          {stepIndex < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(STEPS[stepIndex + 1])}
              disabled={!canNext}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Setup
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
