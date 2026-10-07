import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import {
  ApiInputError,
  inputErrorResponse,
  isCrossOriginRequest,
  readJsonObject,
  requestIdentifier,
  safeServerError,
} from "@/lib/api";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (isCrossOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!checkRateLimit(`password-reset-complete:${requestIdentifier(request)}`, 10, 60 * 60_000).success) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  try {
    const body = await readJsonObject(request, 2_048);
    if (typeof body.token !== "string" || !/^[A-Za-z0-9_-]{40,60}$/.test(body.token)) {
      throw new ApiInputError("This password link is invalid or has expired.");
    }
    if (typeof body.password !== "string" || body.password.length < 14 || Buffer.byteLength(body.password, "utf8") > 72) {
      throw new ApiInputError("The password must be 14–72 UTF-8 bytes long.");
    }
    const tokenHash = createHash("sha256").update(body.token).digest("hex");
    const password = await hashPassword(body.password);
    const now = new Date();

    const result = await prisma.$transaction(async (transaction) => {
      const reset = await transaction.passwordResetToken.findUnique({
        where: { tokenHash },
        include: { user: { select: { isActive: true, mustSetPassword: true } } },
      });
      if (
        !reset ||
        reset.usedAt ||
        reset.expiresAt <= now ||
        (reset.purpose === "RESET" && !reset.user.isActive) ||
        (reset.purpose === "INVITE" && (!reset.user.isActive || !reset.user.mustSetPassword)) ||
        (reset.purpose !== "RESET" && reset.purpose !== "INVITE")
      ) return false;
      const claimed = await transaction.passwordResetToken.updateMany({
        where: { id: reset.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (claimed.count !== 1) return false;
      await transaction.adminUser.update({
        where: { id: reset.userId },
        data: {
          password,
          ...(reset.purpose === "INVITE" ? { isActive: true } : {}),
          mustSetPassword: false,
          authVersion: { increment: 1 },
          passwordResetTokens: { updateMany: { where: { id: { not: reset.id }, usedAt: null }, data: { usedAt: now } } },
        },
      });
      return true;
    });

    if (!result) return NextResponse.json({ error: "This password link is invalid or has expired." }, { status: 400 });
    return NextResponse.json({ success: true, message: "Password set. You can now sign in." });
  } catch (error) {
    const inputResponse = inputErrorResponse(error);
    if (inputResponse) return inputResponse;
    return safeServerError("Password reset completion failed:", error);
  }
}
