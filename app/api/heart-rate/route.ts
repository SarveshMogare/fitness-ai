import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// We use SUPABASE_SERVICE_ROLE_KEY if available to bypass RLS for server-to-server hardware communication
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, bpm } = body;

    if (!userId || bpm === undefined) {
      return NextResponse.json(
        { error: "Missing userId or bpm in payload" },
        { status: 400 }
      );
    }

    // Insert into the heart_rates table
    const { error } = await supabase
      .from("heart_rates")
      .insert([{ user_id: userId, bpm: bpm }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
