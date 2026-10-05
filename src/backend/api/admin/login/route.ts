import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createAdminToken, isAdminRole, setAdminSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import {
  inputErrorResponse,
  isCrossOriginRequest,
  readJsonObject,
  requestIdentifier,
  requiredText,
  safeServerError,
} from "@/lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (isCrossOriginRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rateLimit = checkRateLimit(`login:${requestIdentifier(request)}`, 5, 60_000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await readJsonObject(request, 2_048);
    const email = requiredText(body.email, "Email", 254).toLowerCase();
    if (typeof body.password !== "string" || !body.password.length || Buffer.byteLength(body.password, "utf8") > 72) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    const password = body.password;
    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    const valid = admin ? await verifyPassword(password, admin.password) : false;
    if (!valid || !admin || !admin.isActive || admin.mustSetPassword || !isAdminRole(admin.role)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await createAdminToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      authVersion: admin.authVersion,
    });
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (error) {
    const inputResponse = inputErrorResponse(error);
    if (inputResponse) return inputResponse;
    return safeServerError("Admin login failed:", error);
  }
}
