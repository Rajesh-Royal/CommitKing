import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertRatingSchema } from "@/shared/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ratingData = insertRatingSchema.parse(body);
    
    // Check if user already rated this item
    const existingRating = await storage.getRating(
      ratingData.user_id,
      ratingData.github_id,
      ratingData.type
    );
    
    if (existingRating) {
      return NextResponse.json(
        { error: "You have already rated this item" },
        { status: 400 }
      );
    }
    
    const rating = await storage.createRating(ratingData);
    return NextResponse.json({ rating });
  } catch (error) {
    console.error("Rating error:", error);
    return NextResponse.json(
      { error: "Failed to create rating" },
      { status: 500 }
    );
  }
}
