import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    console.log("Auth endpoint hit, DATABASE_URL available:", !!process.env.DATABASE_URL);
    const { github_id, username, avatar_url } = await request.json();
    
    console.log("Looking up user with github_id:", github_id);
    let user = await storage.getUserByGithubId(github_id);
    if (!user) {
      console.log("User not found, creating new user");
      user = await storage.createUser({
        github_id,
        username,
        avatar_url,
      });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined
    });
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
