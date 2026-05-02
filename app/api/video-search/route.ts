import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter 'q'" },
        { status: 400 }
      );
    }

    // Fetch the YouTube search results page directly
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch YouTube page");
    }

    const html = await res.text();
    
    // Extract the first video ID from the ytInitialData JSON injected into the page
    const match = html.match(/"videoId":"([^"]{11})"/);

    if (match && match[1]) {
      return NextResponse.json({ videoId: match[1] });
    } else {
      return NextResponse.json(
        { error: "No video found" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Video search error:", error);
    return NextResponse.json(
      { error: "Failed to search video" },
      { status: 500 }
    );
  }
}
