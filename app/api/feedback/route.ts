import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("workout_feedback")
    .insert({ ...body, user_id: user.id })
    .select()
    .single();

  if (error)
    return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
