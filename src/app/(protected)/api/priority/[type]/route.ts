import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const priorityList = await storage.getPriorityList(type);
    return NextResponse.json(priorityList);
  } catch (error) {
    console.error("Priority list error:", error);
    return NextResponse.json(
      { error: "Failed to get priority list" },
      { status: 500 }
    );
  }
}
