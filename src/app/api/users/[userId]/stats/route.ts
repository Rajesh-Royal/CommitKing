import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const ratingCount = await storage.getUserRatingCount(userId);
    return NextResponse.json({ ratingCount });
  } catch (error) {
    console.error("User stats error:", error);
    return NextResponse.json(
      { error: "Failed to get user stats" },
      { status: 500 }
    );
  }
}
