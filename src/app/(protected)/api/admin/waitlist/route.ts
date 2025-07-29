import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    // Simple auth check - you can enhance this with proper admin authentication
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('key');
    
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const limit = parseInt(searchParams.get('limit') || '50');
    const entries = await storage.getWaitlistEntries(limit);
    const count = await storage.getWaitlistCount();
    
    return NextResponse.json({ 
      count,
      entries: entries.map(entry => ({
        id: entry.id,
        email: entry.email,
        github_username: entry.github_username,
        joined_at: entry.joined_at,
      }))
    });
  } catch (error) {
    console.error("Admin waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to get waitlist entries" },
      { status: 500 }
    );
  }
}
