import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  inputErrorResponse,
  optionalInteger,
  optionalUrl,
  readJsonObject,
  requiredText,
  requireAdmin,
  safeServerError,
} from "@/lib/api";

export async function GET(request: Request) {
  const authorization = await requireAdmin(request);
  if (authorization) return authorization;
  try {
    const officers = await prisma.officer.findMany({ orderBy: { order: "asc" }, take: 100 });
    return NextResponse.json({ success: true, officers });
  } catch (error) {
    return safeServerError("Officer listing failed:", error);
  }
}

function officerData(body: Record<string, unknown>, partial = false) {
  const data: Record<string, unknown> = {};
  for (const [field, maxLength] of [
    ["name", 120],
    ["handle", 80],
    ["role", 100],
    ["yearMajor", 120],
    ["tag", 40],
    ["discord", 100],
  ] as const) {
    if (body[field] !== undefined || !partial) data[field] = requiredText(body[field], field, maxLength);
  }
  if (body.imageUrl !== undefined || !partial) data.imageUrl = optionalUrl(body.imageUrl, "Image URL") ?? "";
  if (body.order !== undefined || !partial) data.order = optionalInteger(body.order, "Display order", 0, 0, 10_000);
  return data;
}

export async function POST(request: Request) {
  const authorization = await requireAdmin(request, true, "content:write");
  if (authorization) return authorization;
  try {
    const data = officerData(await readJsonObject(request));
    const officer = await prisma.officer.create({ data: data as Parameters<typeof prisma.officer.create>[0]["data"] });
    return NextResponse.json({ success: true, officer }, { status: 201 });
  } catch (error) {
    const inputResponse = inputErrorResponse(error);
    if (inputResponse) return inputResponse;
    return safeServerError("Officer creation failed:", error);
  }
}

export async function PUT(request: Request) {
  const authorization = await requireAdmin(request, true, "content:write");
  if (authorization) return authorization;
  try {
    const body = await readJsonObject(request);
    const id = requiredText(body.id, "Officer ID", 100);
    const officer = await prisma.officer.update({ where: { id }, data: officerData(body, true) });
    return NextResponse.json({ success: true, officer });
  } catch (error) {
    const inputResponse = inputErrorResponse(error);
    if (inputResponse) return inputResponse;
    return safeServerError("Officer update failed:", error);
  }
}

export async function DELETE(request: Request) {
  const authorization = await requireAdmin(request, true, "content:delete");
  if (authorization) return authorization;
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id || id.length > 100) return NextResponse.json({ error: "A valid officer ID is required." }, { status: 400 });
    await prisma.officer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return safeServerError("Officer deletion failed:", error);
  }
}
