import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const officers = await prisma.officer.findMany({
      orderBy: { order: "asc" },
      take: 100,
    });
    return NextResponse.json({ success: true, officers });
  } catch (error) {
    console.error("Public officer listing failed:", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json({ error: "Unable to load committee information." }, { status: 500 });
  }
}
