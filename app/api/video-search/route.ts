import { NextResponse } from "next/server";
import * as cheerio from "cheerio"; // Force Vercel to bundle this
import ytSearch from "yt-search";

export async function GET(req: Request) {
  // Dummy reference to prevent unused variable error
  if (!cheerio) console.log("Cheerio loaded");
  
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter 'q'" },
        { status: 400 }
      );
    }

    const r = await ytSearch(query);
    
    // Get the top video result
    const video = r.videos.length > 0 ? r.videos[0] : null;

    if (!video) {
      return NextResponse.json(
        { error: "No video found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ videoId: video.videoId });
  } catch (error: any) {
    console.error("Video search error:", error);
    return NextResponse.json(
      { error: "Failed to search video" },
      { status: 500 }
    );
  }
}
