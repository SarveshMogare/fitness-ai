import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_complete) redirect("/dashboard");

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Let{"'"}s Build Your Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about yourself so our AI can create your perfect fitness
            plan.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
