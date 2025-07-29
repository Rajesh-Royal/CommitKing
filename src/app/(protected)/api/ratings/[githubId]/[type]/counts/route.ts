import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ githubId: string; type: string }> }
) {
  try {
    const { githubId, type } = await params;
    const counts = await storage.getRatingCounts(githubId, type);
    return NextResponse.json(counts);
  } catch (error) {
    console.error("Rating counts error:", error);
    return NextResponse.json(
      { error: "Failed to get rating counts" },
      { status: 500 }
    );
  }
}
