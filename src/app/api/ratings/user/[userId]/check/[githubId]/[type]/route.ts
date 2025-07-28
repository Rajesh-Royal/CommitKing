import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; githubId: string; type: string } }
) {
  try {
    const { userId, githubId, type } = params;
    const rating = await storage.getRating(userId, githubId, type);
    return NextResponse.json({ 
      hasRated: !!rating, 
      rating: rating?.rating 
    });
  } catch (error) {
    console.error("Check rating error:", error);
    return NextResponse.json(
      { error: "Failed to check rating" },
      { status: 500 }
    );
  }
}
