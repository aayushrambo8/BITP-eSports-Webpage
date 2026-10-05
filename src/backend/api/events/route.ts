import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { isoDate: "asc" },
      take: 200,
    });
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("Public event listing failed:", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json({ error: "Unable to load events." }, { status: 500 });
  }
}
