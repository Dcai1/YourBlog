import { GetUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
  const user = await GetUser();

  if (!user) {
    return NextResponse.json({ message: null }, { status: 200 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
