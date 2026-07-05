import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma_client";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  // email regex here

  // grab email, password, first and last name from request
  const { email, password, firstName, lastName } = await req.json();

  // TODO: test email with regex
  // here

  // TODO: test password with regex
  // here

  // TODO: validate first and last names are type strings and not empty
  // here

  // Validate Unique Email
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 },
    );
  }

  // password security is tested through a regex on the frontend
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
