import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/app/lib/prisma_client";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  // Get the data from request
  const { email, password } = await req.json();

  // Validate the email and password input

  if (!email || !password) {
    return NextResponse.json(
      { error: "Please fill out the required fields before submitting." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  if (!existingUser) {
    return NextResponse.json(
      { error: "This email does not exist." },
      { status: 400 }
    );
  }

  const validPassword = await bcrypt.compare(password, existingUser.password);
  if (!validPassword) {
    return NextResponse.json(
      { error: "Password does not match." },
      { status: 400 }
    );
  }

  // Logic: Log the user in and issue a session
  const sessionId = randomUUID();
  const expirationDate = new Date(Date.now() + 60000000); // 1000 minutes

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: existingUser.id,
      createdAt: new Date(),
      expiresAt: expirationDate,
    },
  });

  // Notify frontend with a response and insert the session as browser cookie
  const response = NextResponse.json(
    { message: "Login successful" },
    { status: 200 }
  );

  response.cookies.set("sessionId", sessionId, {
    httpOnly: true,
    expires: expirationDate,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return response;
}
