"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/workouts": "Workout Plan",
  "/dashboard/nutrition": "Nutrition Plan",
  "/dashboard/progress": "Progress Tracker",
  "/dashboard/profile": "Profile Settings",
};

export function DashboardHeader({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onToggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <h1 className="text-xl font-bold tracking-tight text-card-foreground">
        {title}
      </h1>
    </header>
  );
}
