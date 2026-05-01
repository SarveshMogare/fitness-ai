"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function HeartRateMonitor() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get the currently logged-in user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    };
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    if (!userId) return;

    // Threshold for the alert
    const threshold = 100;

    // Subscribe to new rows in heart_rates
    const channel = supabase
      .channel("heart-rate-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "heart_rates",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBpm = payload.new.bpm;

          if (newBpm > threshold) {
            toast.error("High Heart Rate Alert!", {
              description: `Your heart rate is currently ${newBpm} BPM. Please take a moment to rest.`,
              duration: 10000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return null; // This component is invisible
}
