import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap, Dumbbell, UtensilsCrossed, TrendingUp, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .single();

    if (profile?.onboarding_complete) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">FitForge AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Brain className="h-4 w-4" />
          Powered by AI
        </div>
        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Your Personal AI
          <span className="text-primary"> Fitness Architect</span>
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Adaptive workout plans, TDEE-based nutrition, and progress tracking
          that evolves with you. Built by AI, backed by science.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">Start Your Journey</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>

        <div className="mt-20 grid w-full max-w-4xl gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-card-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Adaptive Workouts</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              7-day plans that adjust difficulty based on your performance feedback
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-card-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">TDEE Meal Plans</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Macro-optimized nutrition tailored to your goals and dietary preferences
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-card-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Progress Insights</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Visual charts tracking weight, energy, sleep, and workout completion
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        Built with AI SDK, Supabase, and Next.js
      </footer>
    </div>
  );
}
