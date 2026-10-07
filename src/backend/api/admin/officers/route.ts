import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAdminActivity } from "@/lib/admin-activity";
import {
  ApiInputError,
  inputErrorResponse,
  optionalInteger,
  optionalText,
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
    const photos = await prisma.officerPhoto.findMany({
      where: { officerId: { in: officers.map((officer) => officer.id) } },
      select: { officerId: true, updatedAt: true },
    });
    const photoUpdatedAt = new Map(photos.map((photo) => [photo.officerId, photo.updatedAt.getTime()]));
    return NextResponse.json({
      success: true,
      officers: officers.map((officer) => ({
        ...officer,
        photoUrl: photoUpdatedAt.has(officer.id)
          ? `/api/officers/${officer.id}/photo?v=${photoUpdatedAt.get(officer.id)}`
          : null,
      })),
    });
  } catch (error) {
    return safeServerError("Officer listing failed:", error);
  }
}

function officerData(body: Record<string, unknown>, partial = false) {
  const data: Record<string, unknown> = {};
  for (const [field, maxLength] of [["name", 120], ["rollNo", 40]] as const) {
    if (body[field] !== undefined || !partial) data[field] = requiredText(body[field], field, maxLength);
  }
  if (body.role !== undefined || !partial) {
    const role = requiredText(body.role, "Post", 100);
    if (!["President", "Senior Coordinator", "Junior Coordinator"].includes(role)) {
      throw new ApiInputError("Post must be President, Senior Coordinator, or Junior Coordinator.");
    }
    data.role = role;
  }
  for (const [field, maxLength] of [
    ["handle", 80],
    ["yearMajor", 120],
    ["tag", 40],
    ["discord", 100],
  ] as const) {
    if (body[field] !== undefined || !partial) data[field] = optionalText(body[field], field, maxLength) ?? "";
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
    await recordAdminActivity({ action: "CREATE", entity: "Committee member", entityId: officer.id, itemLabel: officer.name });
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
    await recordAdminActivity({ action: "UPDATE", entity: "Committee member", entityId: officer.id, itemLabel: officer.name });
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
    const officer = await prisma.officer.delete({ where: { id } });
    await recordAdminActivity({ action: "DELETE", entity: "Committee member", entityId: officer.id, itemLabel: officer.name });
    return NextResponse.json({ success: true });
  } catch (error) {
    return safeServerError("Officer deletion failed:", error);
  }
}
