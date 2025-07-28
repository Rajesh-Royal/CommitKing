import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const { github_id, username, avatar_url } = await request.json();
    
    let user = await storage.getUserByGithubId(github_id);
    if (!user) {
      user = await storage.createUser({
        github_id,
        username,
        avatar_url,
      });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
