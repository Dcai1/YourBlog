import { prisma } from "@/app/lib/prisma_client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const sessionId = req.cookies.get("sessionId")?.value;

  if (!sessionId) {
    return NextResponse.json(
      { message: "User has no active session." },
      { status: 400 }
    );
  }

  await prisma.session.deleteMany({ where: { id: sessionId } });

  const response = NextResponse.json(
    { message: "Cookie cleared successfully" },
    { status: 200 }
  );

  response.cookies.set("sessionId", "", {
    expires: new Date(0), // expires immediately
    httpOnly: true,
    path: "/",
  });

  return response;
}
