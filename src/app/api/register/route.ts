import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma_client";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // grab email, password, first and last name from request (untrusted)
  const { email, password, firstName, lastName } = await req.json();

  // Server-side validation

  // Regex to confirm email matches intended format
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // validate email
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format." },
      { status: 400 },
    );
  }

  // password validation

  // ensure password is a string
  if (!password || typeof password !== "string") {
    return NextResponse.json(
      { error: "Password is required." },
      { status: 400 },
    );
  }

  // ensure pw matches requirements
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }
  // uppercase regex to validate pw
  if (!/[A-Z]/.test(password)) {
    return NextResponse.json(
      { error: "Password must include at least one uppercase letter." },
      { status: 400 },
    );
  }
  // validate pw for numbers
  if (!/[0-9]/.test(password)) {
    return NextResponse.json(
      { error: "Password must include at least one number." },
      { status: 400 },
    );
  }

  // validate pw for special characters
  if (!/[!@#$%^&*]/.test(password)) {
    return NextResponse.json(
      { error: "Password must include at least one special character." },
      { status: 400 },
    );
  }

  // validate that first name is a string
  if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
    return NextResponse.json(
      { error: "First name is required." },
      { status: 400 },
    );
  }

  // validate that last name is a string
  if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
    return NextResponse.json(
      { error: "Last name is required." },
      { status: 400 },
    );
  }

  // Validate Unique Email
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 },
    );
  }

  // Hash password using 12 salt rounds
  const hashedPassword = await bcrypt.hash(password, 12);

  // Code Logic

  // Put all the data into the database
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });

  // Return a message to the frontend
  if (newUser) {
    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 },
    );
  }
}
